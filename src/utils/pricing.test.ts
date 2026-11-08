import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPrice,
  calculatePriceWithGST,
  validateContactForm,
  generateQuickBlueprint,
} from './pricing';

test('formatPrice uses Rs. prefix and never ₹ symbol', () => {
  const result = formatPrice(19999);
  assert.equal(result, 'Rs. 19,999');
  assert.equal(result.includes('₹'), false);

  const resultLarge = formatPrice(39999);
  assert.equal(resultLarge, 'Rs. 39,999');
  assert.equal(resultLarge.includes('₹'), false);
});

test('calculatePriceWithGST computes 18% tax accurately', () => {
  const breakdown = calculatePriceWithGST(19999, 18);
  assert.equal(breakdown.base, 19999);
  // 19999 * 0.18 = 3599.82 -> rounded 3600
  assert.equal(breakdown.gstAmount, 3600);
  assert.equal(breakdown.total, 23599);
});

test('validateContactForm rejects empty and invalid emails/phones', () => {
  const invalid = validateContactForm({
    name: 'A',
    email: 'bad-email',
    phone: '123',
    projectDetails: 'short',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.projectDetails);
});

test('validateContactForm approves valid client details', () => {
  const valid = validateContactForm({
    name: 'Alexander Wright',
    email: 'alex@company.com',
    phone: '+91 9876543210',
    serviceType: 'No-Code Automation',
    budgetRange: 'Rs. 19,999 - Rs. 40,000',
    projectDetails: 'We need to automate customer booking workflows and sync with our CRM.',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('generateQuickBlueprint generates correct category and baseline price Rs. 19,999', () => {
  const commerce = generateQuickBlueprint('I want an online store with cart and payments');
  assert.equal(commerce.category, 'D2C Commerce & Ordering App');
  assert.equal(commerce.basePrice, 19999);

  const automation = generateQuickBlueprint('Need n8n zapier automated pipelines for invoices');
  assert.equal(automation.category, 'Enterprise No-Code Automation Pipeline');
  assert.equal(automation.basePrice, 19999);
});
