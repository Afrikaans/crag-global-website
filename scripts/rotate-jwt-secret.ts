#!/usr/bin/env tsx
import crypto from 'crypto';
import { execSync } from 'child_process';

const newSecret = crypto.randomBytes(64).toString('hex');
console.log('New secret:', newSecret);
console.log('Add to secret manager, then re-deploy.');
// Example: AWS ssm put-parameter --name "/crag/jwt_secret" --value "${newSecret}" --type SecureString --overwrite
