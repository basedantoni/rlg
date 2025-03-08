import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { UserJSON, WebhookEvent } from '@clerk/nextjs/server';
import { env } from '#lib/env.mjs';
import { createUser, deleteUser, updateUser } from '#lib/api/users/mutations';

export async function POST(req: Request) {
  const SIGNING_SECRET = env.CLERK_SIGNING_SECRET as string;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: please add SIGNING_SECRET from Clerk dahsboard to .env or .env.local'
    );
  }

  // Create svix instance
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix Headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    const message = (err as Error).message ?? 'Could not verify webhook';
    console.error(message);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }
  // Do something with payload
  // For this guide, log payload to console
  const { id, first_name: firstName } = evt.data as UserJSON;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log('Webhook payload:', body);

  switch (eventType) {
    case 'user.created':
      await createUser({
        id,
        name: firstName,
        xp: 0,
        level: 0,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      });
      break;
    case 'user.updated':
      await updateUser(id, {
        name: firstName,
        updatedAt: new Date().toUTCString(),
      });
      break;
    case 'user.deleted':
      await deleteUser(id);
      break;
  }
  return new Response('Webhook received', { status: 200 });
}
