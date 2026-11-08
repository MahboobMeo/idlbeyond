import { getAccessToken } from './googleAuth';

export interface GoogleContact {
  resourceName: string; // e.g. "people/c123456789"
  etag?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  photoUrl?: string;
  notes?: string;
}

/**
 * Normalizes People API Person object to a flat GoogleContact
 */
function normalizePerson(person: any): GoogleContact {
  const nameObj = person.names?.[0];
  const emailObj = person.emailAddresses?.[0];
  const phoneObj = person.phoneNumbers?.[0];
  const orgObj = person.organizations?.[0];
  const photoObj = person.photos?.[0];

  return {
    resourceName: person.resourceName,
    etag: person.etag,
    name: nameObj?.displayName || `${nameObj?.givenName || ''} ${nameObj?.familyName || ''}`.trim() || 'Unnamed Contact',
    givenName: nameObj?.givenName || '',
    familyName: nameObj?.familyName || '',
    email: emailObj?.value || '',
    phone: phoneObj?.value || '',
    company: orgObj?.name || '',
    jobTitle: orgObj?.title || '',
    photoUrl: photoObj?.url || '',
  };
}

/**
 * List contacts from Google People API
 */
export async function listGoogleContacts(options?: {
  pageSize?: number;
}): Promise<{ contacts: GoogleContact[]; totalCount: number }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required: Access token missing.');

  const pageSize = options?.pageSize || 50;
  const personFields = 'names,emailAddresses,phoneNumbers,photos,organizations';
  const url = `https://people.googleapis.com/v1/people/me/connections?personFields=${personFields}&pageSize=${pageSize}&sortOrder=LAST_MODIFIED_DESCENDING`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch contacts (${res.status})`);
  }

  const data = await res.json();
  const connections = data.connections || [];
  const contacts = connections.map(normalizePerson);

  return {
    contacts,
    totalCount: data.totalPeople || contacts.length,
  };
}

/**
 * Create a new contact in Google Contacts
 * MANDATORY: Call this only after explicit confirmation from the user in UI!
 */
export async function createGoogleContact(contactData: {
  givenName: string;
  familyName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
}): Promise<GoogleContact> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required: Access token missing.');

  const body: Record<string, any> = {
    names: [
      {
        givenName: contactData.givenName,
        familyName: contactData.familyName || '',
      },
    ],
  };

  if (contactData.email) {
    body.emailAddresses = [{ value: contactData.email, type: 'work' }];
  }

  if (contactData.phone) {
    body.phoneNumbers = [{ value: contactData.phone, type: 'work' }];
  }

  if (contactData.company || contactData.jobTitle) {
    body.organizations = [
      {
        name: contactData.company || '',
        title: contactData.jobTitle || '',
      },
    ];
  }

  const res = await fetch('https://people.googleapis.com/v1/people:createContact', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create contact (${res.status})`);
  }

  const data = await res.json();
  return normalizePerson(data);
}

/**
 * Delete a contact from Google Contacts
 * MANDATORY: Call this only after explicit confirmation from the user in UI!
 */
export async function deleteGoogleContact(resourceName: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required: Access token missing.');

  const res = await fetch(`https://people.googleapis.com/v1/${resourceName}:deleteContact`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete contact (${res.status})`);
  }
}
