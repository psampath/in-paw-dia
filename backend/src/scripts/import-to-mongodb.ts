import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config/env';
import { User } from '../models/User';
import { Pet } from '../models/Pet';
import { Species } from '../models/Species';
import { Question } from '../models/Question';
import { Trait } from '../models/Trait';
import { UserResponse } from '../models/UserResponse';

const DATA_DIR = path.join(__dirname, '../../data-export');

interface ImportResult {
  collection: string;
  count: number;
  success: boolean;
  error?: string;
}

// Helper to convert UUID to ObjectId (deterministic)
function uuidToObjectId(uuid: string): mongoose.Types.ObjectId {
  // Take first 24 characters of UUID (remove hyphens) and use as ObjectId
  const hex = uuid.replace(/-/g, '').substring(0, 24);
  return new mongoose.Types.ObjectId(hex);
}

async function connectDB() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function readJsonFile(filename: string): Promise<any[]> {
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return [];
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

async function importSpecies(): Promise<ImportResult> {
  try {
    console.log('📦 Importing species...');
    const data = await readJsonFile('species.json');

    if (data.length === 0) {
      return { collection: 'species', count: 0, success: true };
    }

    const species = data.map((item: any) => ({
      _id: uuidToObjectId(item.id),
      name: item.name,
      slug: item.slug,
      description: item.description,
      icon_url: item.icon_url,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    await Species.insertMany(species);
    console.log(`✅ Imported ${species.length} species`);

    return { collection: 'species', count: species.length, success: true };
  } catch (error: any) {
    console.error('❌ Failed to import species:', error);
    return { collection: 'species', count: 0, success: false, error: error.message };
  }
}

async function importPets(): Promise<ImportResult> {
  try {
    console.log('📦 Importing pets...');
    const data = await readJsonFile('pets.json');

    if (data.length === 0) {
      return { collection: 'pets', count: 0, success: true };
    }

    const pets = data.map((item: any) => ({
      _id: uuidToObjectId(item.id),
      name: item.name,
      type: item.type,
      slug: item.slug,
      origin: item.origin,
      physical_appearance: item.physical_appearance,
      temperament: item.temperament,
      lifespan: item.lifespan,
      care_requirements: item.care_requirements,
      health_issues: item.health_issues,
      suitability: item.suitability,
      weight_range: item.weight_range,
      size: item.size,
      photos: item.photos || [],
      traits: item.traits || {},
      species_id: item.species_id ? uuidToObjectId(item.species_id) : undefined,
      is_featured: item.is_featured || false,
      popularity_score: item.popularity_score || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    await Pet.insertMany(pets);
    console.log(`✅ Imported ${pets.length} pets`);

    return { collection: 'pets', count: pets.length, success: true };
  } catch (error: any) {
    console.error('❌ Failed to import pets:', error);
    return { collection: 'pets', count: 0, success: false, error: error.message };
  }
}

async function importUsers(): Promise<ImportResult> {
  try {
    console.log('📦 Importing users...');
    const profiles = await readJsonFile('profiles.json');
    const userRoles = await readJsonFile('user_roles.json');

    if (profiles.length === 0) {
      console.log('⚠️  No profiles to import');
      return { collection: 'users', count: 0, success: true };
    }

    // Create a map of user_id to role
    const roleMap = new Map();
    userRoles.forEach((ur: any) => {
      roleMap.set(ur.user_id, ur.role);
    });

    const users = profiles.map((profile: any) => ({
      _id: uuidToObjectId(profile.id),
      email: profile.email,
      // Generate temporary password - users will need to reset
      password: 'TempPassword123!', // Will be hashed by pre-save hook
      role: roleMap.get(profile.id) || 'viewer',
      refreshTokens: [],
      createdAt: profile.created_at,
    }));

    await User.insertMany(users);
    console.log(`✅ Imported ${users.length} users`);
    console.log('⚠️  NOTE: All users have temporary password "TempPassword123!" - implement password reset!');

    return { collection: 'users', count: users.length, success: true };
  } catch (error: any) {
    console.error('❌ Failed to import users:', error);
    return { collection: 'users', count: 0, success: false, error: error.message };
  }
}

async function importQuestions(): Promise<ImportResult> {
  try {
    console.log('📦 Importing questions...');
    const data = await readJsonFile('questions.json');

    if (data.length === 0) {
      return { collection: 'questions', count: 0, success: true };
    }

    const questions = data.map((item: any) => ({
      _id: uuidToObjectId(item.id),
      text: item.text,
      type: item.type,
      options: item.options,
      trait_mapping: item.trait_mapping,
      order_num: item.order_num,
      weight: item.weight,
      createdAt: item.created_at,
    }));

    await Question.insertMany(questions);
    console.log(`✅ Imported ${questions.length} questions`);

    return { collection: 'questions', count: questions.length, success: true };
  } catch (error: any) {
    console.error('❌ Failed to import questions:', error);
    return { collection: 'questions', count: 0, success: false, error: error.message };
  }
}

async function importTraits(): Promise<ImportResult> {
  try {
    console.log('📦 Importing traits...');
    const data = await readJsonFile('traits.json');

    if (data.length === 0) {
      return { collection: 'traits', count: 0, success: true };
    }

    const traits = data.map((item: any) => ({
      _id: uuidToObjectId(item.id),
      key: item.key,
      label: item.label,
      type: item.type,
      min_value: item.min_value,
      max_value: item.max_value,
      unit: item.unit,
      options: item.options,
      createdAt: item.created_at,
    }));

    await Trait.insertMany(traits);
    console.log(`✅ Imported ${traits.length} traits`);

    return { collection: 'traits', count: traits.length, success: true };
  } catch (error: any) {
    console.error('❌ Failed to import traits:', error);
    return { collection: 'traits', count: 0, success: false, error: error.message };
  }
}

async function importUserResponses(): Promise<ImportResult> {
  try {
    console.log('📦 Importing user responses...');
    const data = await readJsonFile('user_responses.json');

    if (data.length === 0) {
      return { collection: 'user_responses', count: 0, success: true };
    }

    const userResponses = data.map((item: any) => ({
      _id: uuidToObjectId(item.id),
      user_id: item.user_id ? uuidToObjectId(item.user_id) : undefined,
      session_id: item.session_id,
      answers: item.answers,
      recommended_pet_ids: (item.recommended_pet_ids || []).map((id: string) => uuidToObjectId(id)),
      createdAt: item.created_at,
    }));

    await UserResponse.insertMany(userResponses);
    console.log(`✅ Imported ${userResponses.length} user responses`);

    return { collection: 'user_responses', count: userResponses.length, success: true };
  } catch (error: any) {
    console.error('❌ Failed to import user responses:', error);
    return { collection: 'user_responses', count: 0, success: false, error: error.message };
  }
}

async function importAll() {
  console.log('🚀 Starting MongoDB import...\n');

  await connectDB();

  // Clear existing data (CAUTION!)
  console.log('⚠️  Clearing existing collections...');
  await Promise.all([
    Species.deleteMany({}),
    Pet.deleteMany({}),
    User.deleteMany({}),
    Question.deleteMany({}),
    Trait.deleteMany({}),
    UserResponse.deleteMany({}),
  ]);
  console.log('✅ Collections cleared\n');

  const results: ImportResult[] = [];

  // Import in order (species first for foreign keys)
  results.push(await importSpecies());
  results.push(await importPets());
  results.push(await importUsers());
  results.push(await importQuestions());
  results.push(await importTraits());
  results.push(await importUserResponses());

  console.log('\n📊 Import Summary:');
  console.log('═══════════════════════════════════════');

  let totalRecords = 0;
  results.forEach((result) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.collection}: ${result.count} records`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    totalRecords += result.count;
  });

  console.log('═══════════════════════════════════════');
  console.log(`📦 Total records imported: ${totalRecords}`);

  const allSuccess = results.every((r) => r.success);
  if (allSuccess) {
    console.log('\n✅ All data imported successfully!');
  } else {
    console.log('\n⚠️  Some imports failed. Check errors above.');
  }

  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed');
}

// Run the import
importAll().catch((error) => {
  console.error('💥 Import failed:', error);
  process.exit(1);
});
