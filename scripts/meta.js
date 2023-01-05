// @ts-check
import path from "node:path";
import { cwd } from "node:process";
import fs from "node:fs/promises";
import { isNativeError } from "node:util/types";
import {
  get as getJSONSchema,
  bundle as bundleJSONSchema,
} from "@hyperjump/json-schema-bundle";

const schemaFolder = path.join(cwd(), "schema");
const schemaDraft = "https://json-schema.org/draft/2020-12/schema";

await getMetaSchema(schemaFolder, schemaDraft);

/**
 * https://gist.github.com/jdesrosiers/2c7fc711854b1bb3ab8c7c6f19438d7a
 * @param {string} schemaFolder
 * @param {string} schemaDraft
 */
async function getMetaSchema(schemaFolder, schemaDraft) {
  try {
    console.log(`Retrieving meta schema "${schemaDraft}"...`);
    const metaSchema = await getJSONSchema(schemaDraft);
    console.log(`Retrieved meta schema "${schemaDraft}".`);

    console.log(`Bundling meta schema "${schemaDraft}"...`);
    const bundledSchema = await bundleJSONSchema(metaSchema);
    console.log(`Bundled meta schema "${schemaDraft}".`);

    console.log(`Saving meta schema "${schemaDraft}"...`);
    const metaSchemaPath = path.join(schemaFolder, "meta.schema.json");
    const fileContent = JSON.stringify(bundledSchema, undefined, 2);

    await fs.writeFile(metaSchemaPath, fileContent, { encoding: "utf-8" });
    console.log(`Saved meta schema "${schemaDraft}".`);
  } catch (error) {
    if (!isNativeError(error)) {
      throw error;
    }

    throw new Error(`Failed to bundle schema "${schemaDraft}".`, {
      cause: error,
    });
  }
}
