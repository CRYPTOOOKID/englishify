import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const Icons = {
  writing: "✍️",
  speaking: "🗣️",
  reading: "📚",
  listening: "🎧"
};

const sections = [
  {
    id: 'writing',
    title: 'Writing',
    icon: Icons.writing,
    color: 'bg-teal-50 border-teal-200',
    iconColor: 'text-teal-600',
    hoverColor: 'hover:bg-teal-100/50'
  },
  {
    id: 'speaking',
    title: 'Speaking',
    icon: Icons.speaking,
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    hoverColor: 'hover:bg-amber-100/50'
  },
  {
    id: 'reading',
    title: 'Reading',
    icon: Icons.reading,
    color: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600',
    hoverColor: 'hover:bg-indigo-100/50'
  },
  {
    id: 'listening',
    title: 'Listening',
    icon: Icons.listening,
    color: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
    hoverColor: 'hover:bg-rose-100/50'
  }
];

const IeltsPage = ({ onSectionSelect }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden py-20">
      <div className="container px-4 mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-800">IELTS Practice</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Choose a section to practice and improve your IELTS skills</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {sections.map((section) => (
            <motion.div
              key={section.id}
              variants={item}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Card className={`h-full cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 ${section.color}`}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-white ${section.iconColor}`}>
                    <span className="text-3xl">{section.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-800">
                    {section.title}
                  </h3>
                  <Button
                    variant="outline"
                    className={`mt-auto border-2 ${section.iconColor} ${section.hoverColor}`}
                    onClick={() => onSectionSelect(section.id)}
                  >
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default IeltsPage;