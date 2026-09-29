/*
  Warnings:

  - You are about to drop the `agent_conversation_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `agent_conversations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `agent_memories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "agent_conversation_messages" DROP CONSTRAINT "agent_conversation_messages_conversation_id_fkey";

-- DropTable
DROP TABLE "agent_conversation_messages";

-- DropTable
DROP TABLE "agent_conversations";

-- DropTable
DROP TABLE "agent_memories";
