import { getAccessToken } from './googleAuth';

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  cc?: string;
}

/**
 * Encodes an RFC 2822 formatted email to base64url
 */
function createRawEmail(to: string, subject: string, bodyText: string, cc?: string): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    ...(cc ? [`Cc: ${cc}`] : []),
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    bodyText,
  ];
  const message = messageParts.join('\r\n');
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email using the user's authenticated Gmail account.
 */
export async function sendGmailMessage(payload: SendEmailPayload): Promise<{ id: string; threadId: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('You must be signed in with Google to send messages via Gmail.');
  }

  const raw = createRawEmail(payload.to, payload.subject, payload.body, payload.cc);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to send email via Gmail (status ${response.status}).`);
  }

  return response.json();
}

/**
 * Lists recent messages in user's Gmail mailbox
 */
export async function listGmailMessages(query: string = '', maxResults: number = 10): Promise<GmailMessageSummary[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Gmail.');
  }

  const queryParams = new URLSearchParams({
    maxResults: String(maxResults),
  });
  if (query) {
    queryParams.set('q', query);
  }

  const listRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!listRes.ok) {
    throw new Error(`Failed to list Gmail messages (status ${listRes.status}).`);
  }

  const listData = await listRes.json();
  const messagesList = listData.messages || [];

  const summaries: GmailMessageSummary[] = [];

  for (const item of messagesList.slice(0, maxResults)) {
    try {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const headers: { name: string; value: string }[] = msgData.payload?.headers || [];
        const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || 'Unknown';
        const to = headers.find((h) => h.name.toLowerCase() === 'to')?.value || '';
        const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value || '';

        summaries.push({
          id: msgData.id,
          threadId: msgData.threadId,
          snippet: msgData.snippet || '',
          subject,
          from,
          to,
          date,
        });
      }
    } catch {
      // Continue for remaining messages
    }
  }

  return summaries;
}

/**
 * Gets user profile info from Gmail API
 */
export async function getGmailUserProfile(): Promise<{ emailAddress: string; messagesTotal: number; threadsTotal: number }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Gmail.');
  }

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Gmail profile.');
  }

  return res.json();
}
