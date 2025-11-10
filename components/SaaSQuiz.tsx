'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, X } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
    icon: string;
  }[];
}

interface QuizResult {
  type: string;
  title: string;
  description: string;
  projects: string[];
  icon: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quel est ton niveau technique ?",
    options: [
      { value: "beginner", label: "Débutant - J'apprends encore", icon: "🌱" },
      { value: "intermediate", label: "Intermédiaire - Je code des projets persos", icon: "💻" },
      { value: "advanced", label: "Avancé - Je suis dev professionnel", icon: "🚀" },
      { value: "nocode", label: "No-code - Je préfère les outils sans code", icon: "🎨" }
    ]
  },
  {
    id: 2,
    question: "Combien de temps peux-tu consacrer par semaine ?",
    options: [
      { value: "5h", label: "5-10h - Side project le soir", icon: "🌙" },
      { value: "20h", label: "20-30h - Mi-temps", icon: "⏰" },
      { value: "40h", label: "40h+ - Full-time", icon: "💪" },
      { value: "weekend", label: "Weekends uniquement", icon: "📅" }
    ]
  },
  {
    id: 3,
    question: "Quel budget peux-tu investir au départ ?",
    options: [
      { value: "0", label: "0€ - Bootstrap total", icon: "🎯" },
      { value: "500", label: "500€ - Quelques outils", icon: "💰" },
      { value: "2000", label: "2000€+ - Investissement sérieux", icon: "💎" },
      { value: "flexible", label: "Flexible selon le projet", icon: "🔄" }
    ]
  },
  {
    id: 4,
    question: "Quelle niche t'intéresse le plus ?",
    options: [
      { value: "b2b", label: "B2B - Outils pour entreprises", icon: "🏢" },
      { value: "creators", label: "Creators - Outils pour créateurs", icon: "🎨" },
      { value: "dev", label: "Developers - Outils pour devs", icon: "⚙️" },
      { value: "any", label: "Ouvert à tout", icon: "🌍" }
    ]
  },
  {
    id: 5,
    question: "Qu'est-ce qui te motive le plus ?",
    options: [
      { value: "freedom", label: "Liberté - Être mon propre patron", icon: "🦅" },
      { value: "money", label: "Argent - Revenue passif", icon: "💵" },
      { value: "impact", label: "Impact - Aider les gens", icon: "❤️" },
      { value: "learning", label: "Apprentissage - Développer mes skills", icon: "📚" }
    ]
  }
];

const results: { [key: string]: QuizResult } = {
  "quick_win": {
    type: "quick_win",
    title: "🎯 Quick Win Hunter",
    description: "Tu es fait pour les micro-SaaS qui génèrent rapidement du revenue avec peu d'investissement. Focus sur les niches précises et les problèmes simples.",
    projects: ["Dashboard template marketplace", "Email signature generator", "Invoice generator"],
    icon: "⚡"
  },
  "technical_builder": {
    type: "technical_builder",
    title: "🚀 Technical Builder",
    description: "Tu as les skills pour créer des SaaS techniques complexes. Vise les outils pour developers ou les APIs spécialisées.",
    projects: ["API monitoring tool", "Code snippet manager", "Developer analytics"],
    icon: "💻"
  },
  "nocode_entrepreneur": {
    type: "nocode_entrepreneur",
    title: "🎨 No-Code Entrepreneur",
    description: "Les outils no-code sont tes meilleurs alliés. Tu peux lancer rapidement sans coder. Focus sur le marketing et la validation.",
    projects: ["Notion templates", "Airtable automations", "Webflow components"],
    icon: "🎨"
  },
  "lifestyle_business": {
    type: "lifestyle_business",
    title: "🌴 Lifestyle Business Builder",
    description: "Tu veux un SaaS qui te donne de la liberté et du revenue passif. Privilégie les modèles d'abonnement stables.",
    projects: ["Membership sites", "Course platforms", "Community tools"],
    icon: "🏖️"
  },
  "impact_maker": {
    type: "impact_maker",
    title: "❤️ Impact Maker",
    description: "Tu veux créer quelque chose qui aide vraiment les gens. Les SaaS B2B avec impact social sont pour toi.",
    projects: ["Productivity tools", "Mental health apps", "Education platforms"],
    icon: "💡"
  }
};

interface SaaSQuizProps {
  onClose: () => void;
}

export default function SaaSQuiz({ onClose }: SaaSQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      // Dernière question - montrer formulaire email
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const calculateResult = (): QuizResult => {
    const profile = {
      technical: answers[1],
      time: answers[2],
      budget: answers[3],
      niche: answers[4],
      motivation: answers[5]
    };

    // Logique de scoring simple
    if (profile.technical === 'nocode') {
      return results.nocode_entrepreneur;
    }
    if (profile.motivation === 'freedom') {
      return results.lifestyle_business;
    }
    if (profile.motivation === 'impact') {
      return results.impact_maker;
    }
    if (profile.technical === 'advanced') {
      return results.technical_builder;
    }
    return results.quick_win;
  };

  const handleSubmitEmail = async () => {
    if (!email || !firstName) {
      alert('Merci de remplir tous les champs');
      return;
    }

    setIsSubmitting(true);

    try {
      const quizResult = calculateResult();

      // Sauvegarder les données du quiz
      await fetch('/api/save-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          answers,
          result: quizResult.type,
          completedAt: new Date().toISOString()
        })
      });

      setResult(quizResult);
      setShowResults(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  if (showResults && result) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-8 animate-slide-up">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{result.icon}</div>
            <h2 className="text-3xl font-bold mb-3">{result.title}</h2>
            <p className="text-zinc-400 text-lg">{result.description}</p>
          </div>

          <div className="bg-black border border-zinc-800 rounded-xl p-6 mb-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Projets SaaS recommandés pour toi :
            </h3>
            <ul className="space-y-3">
              {result.projects.map((project, index) => (
                <li key={index} className="flex items-center gap-3 text-zinc-300">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{project}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-center text-sm mb-4">
              💎 Découvre <strong>50+ projets SaaS réels</strong> dans la base SoloVault, filtrés selon ton profil !
            </p>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/dashboard';
              }}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition"
            >
              Accéder au dashboard →
            </button>
          </div>

          <p className="text-center text-xs text-zinc-500">
            Résultats envoyés à {email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-8 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">
              {currentStep < questions.length ? `Question ${currentStep + 1}/${questions.length}` : 'Dernière étape'}
            </span>
            <span className="text-sm text-orange-500 font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentStep < questions.length ? (
          // Questions
          <div>
            <h2 className="text-2xl font-bold mb-6">{questions[currentStep].question}</h2>
            <div className="space-y-3">
              {questions[currentStep].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition text-left flex items-center gap-4 ${
                    answers[questions[currentStep].id] === option.value
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-zinc-800 bg-black hover:border-orange-500/50'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>

            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="mt-6 flex items-center gap-2 text-zinc-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            )}
          </div>
        ) : (
          // Email form
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Découvre ton résultat !</h2>
              <p className="text-zinc-400">
                Entre ton email pour recevoir ton profil SaaS personnalisé
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
              <button
                onClick={handleSubmitEmail}
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Chargement...' : (
                  <>
                    Voir mes résultats
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="mt-6 flex items-center gap-2 text-zinc-400 hover:text-white transition mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
