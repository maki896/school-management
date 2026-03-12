/**
 * seed.js – Populates the database with default Roles, Users, and Subjects.
 *
 * Usage:
 *   node seed.js
 *   npm run seed
 *
 * Safe to run multiple times – skips records that already exist.
 */

const mongoose = require('mongoose');
const User     = require('./models/User');
const Subject  = require('./models/Subject');
const Role     = require('./models/Role');
require('dotenv').config();

const ROLES = [
    { roleName: 'Admin',   permissions: ['manage_all'] },
    { roleName: 'Teacher', permissions: ['manage_student_marks'] },
    { roleName: 'Student', permissions: ['view_own_grades'] },
];

const USERS = [
    { name: 'Super Admin',   email: 'admin@school.com',   password: 'admin123',   role: 'Admin'   },
    { name: 'Jane Smith',    email: 'teacher@school.com', password: 'teacher123', role: 'Teacher' },
    { name: 'John Doe',      email: 'doe@school.com',     password: 'teacher123', role: 'Teacher' },
    { name: 'Alice Johnson', email: 'student@school.com', password: 'student123', role: 'Student' },
];

const SUBJECTS = [
    { name: 'Mathematics', description: 'Advanced Calculus and Trigonometry'  },
    { name: 'Physics',     description: 'Classical and Modern Physics'         },
    { name: 'Chemistry',   description: 'Organic and Inorganic Chemistry'      },
    { name: 'Biology',     description: 'Cell Biology and Genetics'            },
    { name: 'English',     description: 'Literature, Grammar, and Composition' },
];

async function seedCollection(label, Model, items, keyField) {
    let created = 0;
    for (const item of items) {
        const query = { [keyField]: item[keyField] };
        const exists = await Model.findOne(query);
        if (!exists) {
            await new Model(item).save();
            console.log(`  ✓ Created ${label}: ${item[keyField]}`);
            created++;
        } else {
            console.log(`  – Skipped ${label}: ${item[keyField]} (already exists)`);
        }
    }
    return created;
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('\n✓ Connected to MongoDB\n');

        console.log('📋 Seeding Roles…');
        await seedCollection('Role', Role, ROLES, 'roleName');

        console.log('\n👤 Seeding Users…');
        await seedCollection('User', User, USERS, 'email');

        console.log('\n📚 Seeding Subjects…');
        await seedCollection('Subject', Subject, SUBJECTS, 'name');

        console.log('\n✅ Seeding complete!\n');
        console.log('─────────────────────────────────────────');
        console.log('  Default credentials:');
        console.log('  Admin   → admin@school.com   / admin123');
        console.log('  Teacher → teacher@school.com / teacher123');
        console.log('  Student → student@school.com / student123');
        console.log('─────────────────────────────────────────\n');
        process.exit(0);
    } catch (err) {
        console.error('\n✗ Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
