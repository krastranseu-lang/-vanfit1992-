/**
 * Helper functions for the CargoDimExtractor LLM prompt.
 */

/**
 * Loads the CargoDimExtractor prompt template and inserts the raw text.
 * @param {string} rawText - user provided cargo description
 * @returns {Promise<string>} prompt ready for the language model
 */
export async function buildCargoDimExtractorPrompt(rawText) {
  const response = await fetch('CargoDimExtractorPrompt.md');
  const template = await response.text();
  return template.replace('{RAW_TEXT}', rawText);
}

/**
 * Calls a provided LLM client with the CargoDimExtractor prompt.
 * The client should accept a prompt string and return a stringified JSON
 * matching the schema described in the prompt.
 *
 * @param {string} rawText - free form cargo description text
 * @param {(prompt: string) => Promise<string>} client - LLM call wrapper
 * @returns {Promise<object[]>} parsed JSON array of cargo items
 */
export async function extractCargoDimensionsLLM(rawText, client) {
  const prompt = await buildCargoDimExtractorPrompt(rawText);
  const responseText = await client(prompt);
  return JSON.parse(responseText);
}
