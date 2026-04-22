-- ============================================================
-- KUBO — Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Central auth table (all users: students, teachers, admins)
CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,          -- SHA-256 hex hash
    role       VARCHAR(20)  NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP    DEFAULT NOW()
);

-- Student profiles (linked to users by id)
CREATE TABLE students (
    id                 INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    studynumber        VARCHAR(50),
    email              VARCHAR(100),
    studyline          VARCHAR(100),
    subject            VARCHAR(100),
    class              VARCHAR(20),
    preferred_language VARCHAR(5) DEFAULT 'da',
    time_spent         INT        DEFAULT 0    -- total seconds on modules page
);

-- Teacher profiles (linked to users by id)
CREATE TABLE teachers (
    id            INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    teachernumber VARCHAR(50),
    email         VARCHAR(100),
    studyline     VARCHAR(100),
    class         VARCHAR(20),
    subject       VARCHAR(100)
);

-- Admin profiles (linked to users by id)
CREATE TABLE admin (
    id        INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    license   VARCHAR(100),
    usercount INT DEFAULT 0
);

-- Test scores — one row per student per module
CREATE TABLE testscores (
    id            SERIAL    PRIMARY KEY,
    student_id    INT       NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    module        VARCHAR(50) NOT NULL,
    score         INT       NOT NULL DEFAULT 0,
    time_spent    INT       DEFAULT 0,
    last_activity TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, module)              -- enables upsert
);

-- Calendar events — one row per event
CREATE TABLE calendar_events (
    id         SERIAL       PRIMARY KEY,
    student_id INT          NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    event_date DATE         NOT NULL,
    event_text VARCHAR(500) NOT NULL
);

-- Teacher evaluations of students
CREATE TABLE evaluations (
    id              SERIAL    PRIMARY KEY,
    student_id      INT       NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id      INT       NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    risk_level      VARCHAR(20),
    evaluation_text TEXT,
    sent_to_admin   BOOLEAN   DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, teacher_id)          -- one evaluation per teacher-student pair
);

-- ============================================================
-- Disable Row Level Security for development.
-- Re-enable and add policies before going to production.
-- ============================================================
ALTER TABLE users            DISABLE ROW LEVEL SECURITY;
ALTER TABLE students         DISABLE ROW LEVEL SECURITY;
ALTER TABLE teachers         DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin            DISABLE ROW LEVEL SECURITY;
ALTER TABLE testscores       DISABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events  DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations      DISABLE ROW LEVEL SECURITY;
