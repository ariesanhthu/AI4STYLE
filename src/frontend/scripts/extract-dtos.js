const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.resolve(__dirname, '../src/lib/open-api-client/open-api.ts');
const OUTPUT_FILE_ADMIN = path.resolve(__dirname, '../src/lib/open-api-client/type.admin.ts');
const OUTPUT_FILE_CLIENT = path.resolve(__dirname, '../src/lib/open-api-client/type.client.ts');

console.log(`Reading from: ${INPUT_FILE}`);
console.log(`Writing Admin types to: ${OUTPUT_FILE_ADMIN}`);
console.log(`Writing Client types to: ${OUTPUT_FILE_CLIENT}`);

if (!fs.existsSync(INPUT_FILE)) {
  console.error(`Input file not found: ${INPUT_FILE}`);
  process.exit(1);
}

const content = fs.readFileSync(INPUT_FILE, 'utf-8');

// Extract the operations interface body
const operationsMatch = content.match(/export interface operations\s*{([\s\S]*?)\n}/);
if (!operationsMatch) {
  console.error('Could not find operations interface in the input file.');
  process.exit(1);
}

const operationsBody = operationsMatch[1];
const operationKeys = [];
// Match keys that are at the start of the line with some indentation (likely 4 spaces)
const keyRegex = /^(\s+)"([^"]+)":\s*{/gm;
let match;

while ((match = keyRegex.exec(operationsBody)) !== null) {
  const indentation = match[1].replace(/\n/g, '');
  const key = match[2];

  // Accept 2 or 4 spaces
  if (indentation.length === 4 || indentation.length === 2) {
    operationKeys.push(key);
  }
}

console.log(`Found ${operationKeys.length} operations.`);

const commonHeader = [
  `import { operations } from './open-api';`,
  '',
  '// Helper types to extract Request and Response bodies',
  `export type OperationParams<T> = T extends { parameters: { query?: infer Q } } ? Q : never;`,
  `export type OperationRequest<T> = T extends { requestBody?: { content: { 'application/json': infer R } } } ? R : never;`,
  `export type OperationResponse<T> = T extends { responses: { 200: { content: { 'application/json': infer R } } } } ? R : T extends { responses: { 201: { content: { 'application/json': infer R } } } } ? R : never;`,
  ''
];

const adminLines = [...commonHeader];
const clientLines = [...commonHeader];

operationKeys.forEach(key => {
  // Clean up the key to make a valid and nice type name
  // Example: "RoleController_getListRoles_shop/v1" -> "RoleController_getListRoles"
  let name = key.replace(/_shop\/v1$/, '');
  const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');

  const lines = [
    `// Operation: ${key}`,
    `export type ${safeName}_Params = OperationParams<operations['${key}']>;`,
    `export type ${safeName}_Request = OperationRequest<operations['${key}']>;`,
    `export type ${safeName}_Response = OperationResponse<operations['${key}']>;`,
    ''
  ];

  // Logic to split: if safeName contains "Admin", it goes to admin file.
  // Otherwise it goes to client file.
  if (safeName.includes('Admin')) {
    adminLines.push(...lines);
  } else {
    clientLines.push(...lines);
  }
});

fs.writeFileSync(OUTPUT_FILE_ADMIN, adminLines.join('\n'));
fs.writeFileSync(OUTPUT_FILE_CLIENT, clientLines.join('\n'));

console.log(`Successfully generated types in ${OUTPUT_FILE_ADMIN} and ${OUTPUT_FILE_CLIENT}`);
