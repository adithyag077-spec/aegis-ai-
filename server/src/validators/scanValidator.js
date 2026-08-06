const { z } = require('zod');

const phishingScanSchema = z.object({
  content: z.string().min(5, 'Scan input must be at least 5 characters long'),
  type: z.enum(['URL', 'EMAIL_TEXT']).default('URL')
});

const scamTextScanSchema = z.object({
  messageText: z.string().min(5, 'Message content must be at least 5 characters'),
  senderInfo: z.string().optional()
});

const fakeWebsiteScanSchema = z.object({
  url: z.string().url('Must provide a valid URL starting with http:// or https://')
});

const qrScanSchema = z.object({
  payloadText: z.string().optional(),
  imageUrl: z.string().optional()
});

const privacyLeakScanSchema = z.object({
  text: z.string().min(3, 'Text must be at least 3 characters long')
});

module.exports = {
  phishingScanSchema,
  scamTextScanSchema,
  fakeWebsiteScanSchema,
  qrScanSchema,
  privacyLeakScanSchema
};
