// Service pour gérer les appels à l'API IA
interface AIResponse {
  message: string;
  suggestions?: string[];
  needsFollowUp?: boolean;
}

interface ConversationContext {
  messages: { role: 'user' | 'assistant'; content: string }[];
  clientType?: 'individual' | 'couple';
  appointmentRequested?: boolean;
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    // En production, ces valeurs viendraient des variables d'environnement
    this.apiKey = process.env.VITE_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async sendMessage(
    message: string, 
    context: ConversationContext
  ): Promise<AIResponse> {
    
    // Pour le développement, utilisons des réponses simulées intelligentes
    if (!this.apiKey) {
      return this.getSimulatedResponse(message, context);
    }

    try {
      const systemPrompt = this.getSystemPrompt();
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...context.messages,
        { role: 'user' as const, content: message }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages,
          max_tokens: 300,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.choices[0]?.message?.content || 'Je suis désolée, je n\'ai pas pu traiter votre demande.';

      return {
        message: aiMessage,
        needsFollowUp: this.needsFollowUp(message, aiMessage)
      };

    } catch (error) {
      console.error('Erreur API IA:', error);
      return this.getSimulatedResponse(message, context);
    }
  }

  private getSystemPrompt(): string {
    return `Tu es une assistante virtuelle professionnelle pour un service d'accompagnement haut de gamme à Paris. 

CONTEXTE :
- Tu travailles pour Julien, un escort professionnel légal qui accompagne femmes et couples
- Tes rôles : prise de rendez-vous, information sur services, première qualification des demandes
- Ton ton : professionnel, discret, respectueux, chaleureux mais pas familier

SERVICES PROPOSÉS :
- Accompagnement événements culturels (opéra, théâtre, vernissages)
- Sorties restaurants gastronomiques  
- Accompagnement voyages
- Services pour couples
- Accompagnement événements sociaux/professionnels

RÈGLES IMPORTANTES :
1. Toujours maintenir la confidentialité et la discrétion
2. Ne jamais donner de détails explicites ou vulgaires
3. Orienter vers la prise de rendez-vous téléphonique pour les détails sensibles
4. Être empathique et compréhensive
5. Poser des questions qualifiantes discrètes (type d'événement, durée souhaitée, etc.)
6. Rassurer sur le professionnalisme et la légalité du service

STYLE DE RÉPONSE :
- Phrases courtes et claires
- Vocabulaire sophistiqué mais accessible
- Empathie et bienveillance
- Proposer des solutions concrètes

Tu ne dois jamais :
- Donner de tarifs précis (renvoyer vers l'échange téléphonique)
- Entrer dans des détails intimes
- Juger ou critiquer les demandes
- Révéler d'informations sur d'autres clients`;
  }

  private getSimulatedResponse(message: string, context: ConversationContext): AIResponse {
    const msg = message.toLowerCase();
    
    // Détection du type de client
    if (msg.includes('couple') && !context.clientType) {
      context.clientType = 'couple';
    }
    
    // Réponses contextuelles intelligentes
    if (msg.includes('bonjour') || msg.includes('salut') || context.messages.length === 0) {
      return {
        message: "Bonjour ! Je suis ravie de vous accueillir. Je suis l'assistante de Julien pour la gestion de ses rendez-vous d'accompagnement. Comment puis-je vous aider aujourd'hui ?",
        suggestions: ["Prendre rendez-vous", "Informations sur les services", "Questions sur la discrétion"]
      };
    }
    
    if (msg.includes('rendez-vous') || msg.includes('rdv') || msg.includes('appointment')) {
      context.appointmentRequested = true;
      return {
        message: "Parfait ! Je vais vous aider à organiser un rendez-vous avec Julien. Pour vous proposer l'accompagnement le plus adapté, pourriez-vous me préciser :\n\n• Le type d'événement ou de sortie envisagé ?\n• La date et durée souhaitées ?\n• S'agit-il d'un accompagnement individuel ou pour un couple ?\n\nToutes ces informations restent strictement confidentielles.",
        needsFollowUp: true
      };
    }
    
    if (msg.includes('tarif') || msg.includes('prix') || msg.includes('coût')) {
      return {
        message: "Les tarifs varient selon le type d'accompagnement, la durée et les spécificités de votre demande. Pour respecter votre confidentialité et vous donner un devis personnalisé précis, Julien préfère en discuter directement lors d'un échange téléphonique.\n\nSouhaitez-vous que je programme un appel de présentation ?",
        needsFollowUp: true
      };
    }
    
    if (msg.includes('couple')) {
      return {
        message: "Julien propose effectivement des services d'accompagnement spécialement conçus pour les couples. Cela peut inclure :\n\n• Accompagnement à des événements sociaux\n• Sorties culturelles à trois\n• Voyages ou week-ends\n• Soirées restaurants raffinées\n\nChaque prestation est adaptée à vos souhaits spécifiques. Quel type d'accompagnement vous intéresserait ?",
        needsFollowUp: true
      };
    }
    
    if (msg.includes('discrétion') || msg.includes('confidentiel') || msg.includes('secret')) {
      return {
        message: "La discrétion est notre priorité absolue et la base de notre service. Voici nos engagements :\n\n• Confidentialité totale sur votre identité\n• Aucune trace ni historique conservé\n• Respect de votre vie privée en toutes circonstances\n• Professionnalisme irréprochable\n\nJulien exerce dans le cadre légal français avec un statut professionnel déclaré. Avez-vous d'autres questions sur nos pratiques ?",
        needsFollowUp: true
      };
    }
    
    if (msg.includes('légal') || msg.includes('autorisé') || msg.includes('loi')) {
      return {
        message: "Absolument, l'activité d'accompagnement de Julien est parfaitement légale en France. Il possède :\n\n• Un statut professionnel déclaré\n• Toutes ses charges sociales et fiscales à jour\n• Une approche respectueuse du cadre légal\n\nSes services se concentrent sur l'accompagnement social et culturel de qualité. Puis-je vous renseigner sur un aspect particulier ?",
        needsFollowUp: true
      };
    }
    
    if (msg.includes('services') || msg.includes('que propose') || msg.includes('accompagnement')) {
      return {
        message: "Julien propose un accompagnement haut de gamme pour diverses occasions :\n\n🎭 **Événements culturels** : Opéra, théâtre, vernissages, concerts\n🍾 **Sorties gastronomiques** : Restaurants étoilés, bars à cocktails\n✈️ **Voyages** : Week-ends, séjours culturels\n👥 **Événements sociaux** : Réceptions, galas, soirées d'entreprise\n💑 **Services couples** : Accompagnement personnalisé\n\nQuel type d'accompagnement vous intéresserait le plus ?",
        suggestions: ["Événements culturels", "Restaurants", "Voyages", "Services couples"]
      };
    }
    
    // Réponse par défaut intelligente
    return {
      message: "Je comprends votre demande. Pour vous offrir la meilleure réponse et respecter la confidentialité qui nous caractérise, pourriez-vous me donner un peu plus de contexte sur ce que vous recherchez ?\n\nJe suis là pour vous accompagner dans vos démarches avec la plus grande discrétion.",
      needsFollowUp: true
    };
  }
  
  private needsFollowUp(userMessage: string, aiResponse: string): boolean {
    const followUpKeywords = ['souhaitez-vous', 'puis-je', 'avez-vous', '?'];
    return followUpKeywords.some(keyword => aiResponse.includes(keyword));
  }
}

export const aiService = new AIService();