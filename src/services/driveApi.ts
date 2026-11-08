import { getAccessToken } from './googleAuth';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  owners?: Array<{
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  }>;
}

export interface DriveAboutInfo {
  user?: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
    usageInDriveTrash?: string;
  };
}

/**
 * Fetch Google Drive storage and user overview
 */
export async function getDriveAbout(): Promise<DriveAboutInfo> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required: Access token missing.');

  const res = await fetch(
    'https://www.googleapis.com/drive/v3/about?fields=user,storageQuota',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch Drive information (${res.status})`);
  }

  return res.json();
}

/**
 * List files and folders from user's Google Drive
 */
export async function listDriveFiles(options?: {
  query?: string;
  pageSize?: number;
  filterType?: 'all' | 'documents' | 'spreadsheets' | 'folders' | 'blueprints';
}): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required: Access token missing.');

  let q = 'trashed = false';

  if (options?.filterType === 'folders') {
    q += " and mimeType = 'application/vnd.google-apps.folder'";
  } else if (options?.filterType === 'documents') {
    q += " and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/pdf' or mimeType = 'text/plain')";
  } else if (options?.filterType === 'spreadsheets') {
    q += " and (mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'text/csv')";
  } else if (options?.filterType === 'blueprints') {
    q += " and (name contains 'Blueprint' or name contains 'IDLTech' or name contains 'Roadmap')";
  }

  if (options?.query && options.query.trim()) {
    const sanitized = options.query.trim().replace(/'/g, "\\'");
    q += ` and name contains '${sanitized}'`;
  }

  const pageSize = options?.pageSize || 30;
  const fields = 'nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink,thumbnailLink,owners)';

  const url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&fields=${encodeURIComponent(
    fields
  )}&q=${encodeURIComponent(q)}&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to list files from Google Drive (${res.status})`);
  }

  const data = await res.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Create a new folder in Google Drive (e.g. "IDLTech Studio - App Deliverables")
 * Mandatory user confirmation must be handled before calling this function!
 */
export async function createDriveFolder(
  folderName: string,
  parentFolderId?: string
): Promise<DriveFile> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required: Access token missing.');

  const metadata: Record<string, any> = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create folder in Google Drive (${res.status})`);
  }

  return res.json();
}

/**
 * Upload / Save an App Blueprint or project document to Google Drive
 * Mandatory user confirmation must be handled before calling this function!
 */
export async function createDriveDocument(params: {
  name: string;
  content: string;
  mimeType?: string;
  folderId?: string;
}): Promise<DriveFile> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required: Access token missing.');

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata: Record<string, any> = {
    name: params.name,
    mimeType: params.mimeType || 'text/markdown',
  };

  if (params.folderId) {
    metadata.parents = [params.folderId];
  }

  const contentType = params.mimeType || 'text/markdown';

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${contentType}\r\n\r\n` +
    params.content +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to save document to Google Drive (${res.status})`);
  }

  return res.json();
}

/**
 * Delete a file or folder from Google Drive
 * MANDATORY: Call this only after explicit confirmation from the user in UI!
 */
export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required: Access token missing.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete file from Google Drive (${res.status})`);
  }
}
