import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Import Supabase credentials from your current .env
// You'll need to temporarily add these to backend/.env for the export
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const OUTPUT_DIR = path.join(__dirname, '../../data-export');

interface ExportResult {
  table: string;
  count: number;
  success: boolean;
  error?: string;
}

async function exportTable(tableName: string): Promise<ExportResult> {
  try {
    console.log(`📦 Exporting ${tableName}...`);

    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) {
      console.error(`❌ Error exporting ${tableName}:`, error);
      return { table: tableName, count: 0, success: false, error: error.message };
    }

    const count = data?.length || 0;

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write to JSON file
    const filePath = path.join(OUTPUT_DIR, `${tableName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`✅ Exported ${count} records from ${tableName} to ${filePath}`);
    return { table: tableName, count, success: true };
  } catch (error: any) {
    console.error(`❌ Failed to export ${tableName}:`, error);
    return { table: tableName, count: 0, success: false, error: error.message };
  }
}

async function exportAllTables() {
  console.log('🚀 Starting Supabase data export...\n');

  const tables = [
    'pets',
    'species',
    'profiles',
    'user_roles',
    'questions',
    'traits',
    'user_responses',
  ];

  const results: ExportResult[] = [];

  for (const table of tables) {
    const result = await exportTable(table);
    results.push(result);
  }

  console.log('\n📊 Export Summary:');
  console.log('═══════════════════════════════════════');

  let totalRecords = 0;
  results.forEach((result) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.table}: ${result.count} records`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    totalRecords += result.count;
  });

  console.log('═══════════════════════════════════════');
  console.log(`📦 Total records exported: ${totalRecords}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);

  const allSuccess = results.every((r) => r.success);
  if (allSuccess) {
    console.log('\n✅ All tables exported successfully!');
  } else {
    console.log('\n⚠️  Some tables failed to export. Check errors above.');
  }
}

// Run the export
exportAllTables().catch((error) => {
  console.error('💥 Export failed:', error);
  process.exit(1);
});
