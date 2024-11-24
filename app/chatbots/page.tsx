'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserGroupIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface Chatbot {
  id: number;
  name: string;
  status: string | null;
  type: string;
  category: string;
  description: string;
  avatar: string;
  url: string;
  userCount: string;
}

const chatbots: Chatbot[] = [
  {
    id: 1,
    name: "SEO Assistant",
    status: "Active",
    type: "Free",
    category: "SEO et Optimisation de Contenu",
    description: "Optimisez votre contenu web avec notre assistant SEO intelligent. Suggestions de mots-clés, analyse de contenu et recommandations d'optimisation.",
    avatar: "/images/seo-bot.png",
    url: "https://chat.openai.com/g/g-GhEwiy1Qc-seo",
    userCount: "2.5k"
  },
  {
    id: 2,
    name: "Code Helper",
    status: "Active",
    type: "Free",
    category: "Développement Web et Automatisation",
    description: "Assistant de développement pour le débogage, l'optimisation et les suggestions de code. Support pour plusieurs langages de programmation.",
    avatar: "/images/dev-bot.png",
    url: "https://chat.openai.com/g/g-HgZuFuuBK-developer",
    userCount: "3.8k"
  },
  {
    id: 3,
    name: "Analytics Expert",
    status: "Active",
    type: "Free",
    category: "Analytics et Données",
    description: "Analysez vos données et obtenez des insights précieux. Visualisation de données, rapports personnalisés et recommandations basées sur les données.",
    avatar: "/images/analytics-bot.png",
    url: "https://chat.openai.com/g/g-HvPF2V6Zy-analytics",
    userCount: "1.9k"
  },
  {
    id: 4,
    name: "Content Writer",
    status: "Active",
    type: "Free",
    category: "SEO et Optimisation de Contenu",
    description: "Créez du contenu engageant et optimisé pour le SEO. Articles de blog, descriptions de produits et contenu pour réseaux sociaux.",
    avatar: "/images/writer-bot.png",
    url: "https://chat.openai.com/g/g-D5Rb5GGpq-writer",
    userCount: "4.2k"
  },
  {
    id: 5,
    name: "Marketing AI",
    status: "Active",
    type: "Free",
    category: "Marketing Digital",
    description: "Stratégies marketing basées sur l'IA, analyse de campagnes et optimisation des conversions. Idéal pour les marketeurs digitaux.",
    avatar: "/images/marketing-bot.png",
    url: "https://chat.openai.com/g/g-UYyKX4CiH-marketing",
    userCount: "2.8k"
  }
];

const categoryColors: { [key: string]: string } = {
  "SEO et Optimisation de Contenu": "#6C63FF",
  "Création et Rédaction de Contenu": "#FF6584",
  "Développement Web et Automatisation": "#4CAF50",
  "Divers et Polyvalents": "#FFC107",
  "Analytics et Données": "#34A85A",
  "Marketing Digital": "#FF69B4"
};

const getCategoryColor = (category: string) => {
  return `bg-${categoryColors[category]}-100 dark:bg-${categoryColors[category]}-800 text-${categoryColors[category]}-800 dark:text-${categoryColors[category]}-100`;
};

export default function ChatbotsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChatbots = chatbots.filter(chatbot => {
    const matchesSearch = chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatbot.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Nos Chatbots IA</h1>
        
        {/* Barre de recherche */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Rechercher un chatbot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
          />
        </div>

        {/* Grille de chatbots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChatbots.map((chatbot) => (
            <div
              key={chatbot.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16">
                    <Image
                      src={chatbot.avatar}
                      alt={chatbot.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{chatbot.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                      {chatbot.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(chatbot.category)}`}
                  >
                    {chatbot.category}
                  </span>
                </div>

                <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
                  {chatbot.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <UserGroupIcon className="h-5 w-5" />
                    <span>{chatbot.userCount} utilisateurs</span>
                  </div>
                  <a
                    href={chatbot.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  >
                    Accéder
                    <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
