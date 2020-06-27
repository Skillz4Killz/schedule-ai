-- Check if database exists first and if not create it

CREATE DATABASE IF NOT EXISTS "schedule-ai";

-- Create public schema

CREATE SCHEMA IF NOT EXISTS public

-- Set public as current search path
SET search_path TO public -- Create tables

-- First create the guild table

CREATE TABLE IF NOT EXISTS guilds (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "guildID" VARCHAR(19) UNIQUE NOT NULL,
  "createRoleIDs" VARCHAR(19)[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  "defaultCardChannelID" VARCHAR(19) UNIQUE NOT NULL
)

-- Create the reminders table if not available

CREATE TABLE IF NOT EXISTS reminders {
  "id" SERIAL PRIMARY KEY NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "channelID" VARCHAR(19) NOT NULL,
  "content" TEXT NOT NULL,
  "guildID" VARCHAR(19) NOT NULL,
  "reminderID" VARCHAR(19) NOT NULL,
  "interval" INTEGER NOT NULL DEFAULT 0,
  "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
  "userID" VARCHAR(19) NOT NULL,
  "embedEnabled" BOOLEAN NOT NULL DEFAULT true,
}

-- Create the events table if not available

CREATE TABLE IF NOT EXISTS events {
  "id" SERIAL PRIMARY KEY NOT NULL,
  "activity" TEXT NOT NULL,
  "cardChannelID" VARCHAR(19),
  "cardMessageID" VARCHAR(19),
  "allowedRoleIDs" VARCHAR(19)[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  "alertRoleIDS" VARCHAR(19)[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  "attendeeIDs" VARCHAR(19)[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  "authorID" VARCHAR(19),
  "backgroundURL" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "denialIDs" VARCHAR(19)[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  "description" TEXT NOT NULL,
  "dmReminders" BOOLEAN NOT NULL DEFAULT false,
  "duration" INTEGER NOT NULL DEFAULT 0,
  "endTimestamp" TIMESTAMP NOT NULL DEFAULT now(),
  "executedReminders" INTEGER[] DEFAULT ARRAY[]::INTEGER[] NOT NULL,
  "eventID" INTEGER UNIQUE NOT NULL DEFAULT 0,
  "frequency" INTEGER NOT NULL DEFAULT 0,
  "game" TEXT NOT NULL,
  "guildID" VARCHAR(19),
  "hasStarted" BOOLEAN NOT NULL DEFAULT false,
  "isRecurring" BOOLEAN NOT NULL DEFAULT false,
  "maxAttendees" INTEGER NOT NULL DEFAULT 5,
  "maybeIDs" VARCHAR(19)[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  "minutesFromNow" INTEGER NOT NULL DEFAULT 0,
  "platform" TEXT NOT NULL,
  "reminders" INTEGER[] DEFAULT ARRAY[]::INTEGER[] NOT NULL,
  "removeRecurringAttendees" BOOLEAN NOT NULL DEFAULT false,
  "startTimestamp" TIMESTAMP NOT NULL DEFAULT now(),
  "template" TEXT,
  "title" TEXT NOT NULL,
  "waitingListIDs" VARCHAR(19)[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
}
