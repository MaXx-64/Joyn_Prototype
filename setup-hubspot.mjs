/**
 * setup-hubspot.mjs
 * One-time script to create the Joyn Demo Access capture form in HubSpot.
 * Run: node setup-hubspot.mjs
 *
 * Requires a HubSpot Private App token with Forms write scope.
 * Set it as: HUBSPOT_PRIVATE_APP_TOKEN=pat-na1-xxxx node setup-hubspot.mjs
 */

const TOKEN     = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const PORTAL_ID = '20194411';

if (!TOKEN) {
  console.error('ERROR: HUBSPOT_PRIVATE_APP_TOKEN is not set.');
  console.error('Usage: HUBSPOT_PRIVATE_APP_TOKEN=pat-na1-xxxx node setup-hubspot.mjs');
  process.exit(1);
}

async function createForm(payload) {
  const res = await fetch('https://api.hubapi.com/marketing/v3/forms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

const demoForm = {
  name: 'Joyn Demo Access',
  formType: 'hubspot',
  configuration: { cloneable: false, editable: true, archivable: true },
  fieldGroups: [
    {
      groupType: 'default_group',
      richTextType: 'text',
      fields: [
        { objectTypeId: '0-1', name: 'firstname', label: 'First Name',   fieldType: 'text',        required: true  },
        { objectTypeId: '0-1', name: 'lastname',  label: 'Last Name',    fieldType: 'text',        required: true  },
        { objectTypeId: '0-1', name: 'email',     label: 'Email',        fieldType: 'email',       required: true  },
        { objectTypeId: '0-1', name: 'phone',     label: 'Phone Number', fieldType: 'phonenumber', required: false },
      ],
    },
  ],
};

console.log(`\nCreating "Joyn Demo Access" form for portal ${PORTAL_ID}…\n`);

try {
  const result = await createForm(demoForm);
  const guid = result.id || result.formGuid;

  console.log('✓ Form created successfully!\n');
  console.log('════════════════════════════════════════');
  console.log('Copy these values into components/HubSpotCaptureForm.tsx:\n');
  console.log(`const PORTAL_ID = '${PORTAL_ID}';`);
  console.log(`const FORM_GUID = '${guid}';`);
  console.log('════════════════════════════════════════\n');
} catch (err) {
  console.error(`✗ Failed: ${err.message}`);
  process.exit(1);
}
