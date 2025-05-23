import React from 'react';
import FileUpload from '../components/FileUpload';
import FolderManager from '../components/FolderManager';
import AccessControl from '../components/AccessControl';
import FileList from '../components/FileList';
import TagManager from '../components/TagManager';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function DocumentManager() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center">
          <motion.h1
            className="text-4xl font-bold text-blue-800 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            📁 Document Manager
          </motion.h1>
          <motion.p
            className="mt-2 text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Manage your documents, folders, tags, and access control efficiently.
          </motion.p>
        </header>

        {/** Sections with animation */}
        <motion.section
          className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            📤 Upload Files
          </h2>
          <FileUpload />
        </motion.section>

        <motion.section
          className="bg-white rounded-2xl shadow p-6 border-l-4 border-yellow-500"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
            🗂️ Manage Folders
          </h2>
          <FolderManager />
        </motion.section>

        <motion.section
          className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            🏷️ Tag Manager
          </h2>
          <TagManager />
        </motion.section>

        <motion.section
          className="bg-white rounded-2xl shadow p-6 border-l-4 border-purple-500"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
            🔐 Access Control
          </h2>
          <AccessControl />
        </motion.section>

        <motion.section
          className="bg-white rounded-2xl shadow p-6 border-l-4 border-indigo-500"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            📄 Uploaded Files
          </h2>
          <FileList />
        </motion.section>
      </div>
    </div>
  );
}

export default DocumentManager;
