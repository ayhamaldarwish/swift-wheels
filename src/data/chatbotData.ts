export interface ChatbotQuestion {
  id: string;
  question: {
    en: string;
    ar: string;
  };
  answer: {
    en: string;
    ar: string;
  };
  keywords: string[];
}

export interface ChatbotGreeting {
  greeting: {
    en: string;
    ar: string;
  };
  suggestions: {
    en: string[];
    ar: string[];
  };
}

export const chatbotGreeting: ChatbotGreeting = {
  greeting: {
    en: "👋 Hello! I'm your virtual assistant. How can I help you today?",
    ar: "👋 مرحباً! أنا المساعد الافتراضي. كيف يمكنني مساعدتك اليوم؟"
  },
  suggestions: {
    en: [
      "How do I book a car?",
      "Can I cancel my booking?",
      "What payment methods do you accept?",
      "How does the delivery work?"
    ],
    ar: [
      "كيف يمكنني حجز سيارة؟",
      "هل يمكنني إلغاء الحجز؟",
      "ما هي طرق الدفع المقبولة؟",
      "كيف تعمل خدمة التوصيل؟"
    ]
  }
};

export const chatbotQuestions: ChatbotQuestion[] = [
  {
    id: "booking-process",
    question: {
      en: "How do I book a car?",
      ar: "كيف يمكنني حجز سيارة؟"
    },
    answer: {
      en: "Booking a car is easy! Just follow these steps:\n\n1. Browse our available cars\n2. Select the car you like\n3. Choose your rental dates\n4. Confirm your booking\n5. You'll receive a confirmation email with all details",
      ar: "حجز سيارة أمر سهل! فقط اتبع هذه الخطوات:\n\n1. تصفح السيارات المتاحة\n2. اختر السيارة التي تعجبك\n3. اختر تواريخ الإيجار\n4. قم بتأكيد الحجز\n5. ستتلقى بريدًا إلكترونيًا للتأكيد مع جميع التفاصيل"
    },
    keywords: ["book", "booking", "reserve", "reservation", "rent", "how to book"]
  },
  {
    id: "cancel-booking",
    question: {
      en: "Can I cancel my booking?",
      ar: "هل يمكنني إلغاء الحجز؟"
    },
    answer: {
      en: "Yes, you can cancel your booking up to 24 hours before the scheduled pickup time without any cancellation fee. For cancellations made less than 24 hours before pickup, a 20% fee may apply. You can cancel your booking from your account dashboard.",
      ar: "نعم، يمكنك إلغاء الحجز قبل 24 ساعة من وقت الاستلام المحدد دون أي رسوم إلغاء. بالنسبة للإلغاءات التي تتم قبل أقل من 24 ساعة من الاستلام، قد يتم تطبيق رسوم بنسبة 20%. يمكنك إلغاء الحجز من لوحة تحكم حسابك."
    },
    keywords: ["cancel", "cancellation", "refund", "cancel booking"]
  },
  {
    id: "payment-methods",
    question: {
      en: "What payment methods do you accept?",
      ar: "ما هي طرق الدفع المقبولة؟"
    },
    answer: {
      en: "We accept various payment methods including:\n\n• Credit/Debit cards (Visa, MasterCard, American Express)\n• PayPal\n• Apple Pay\n• Google Pay\n• Bank transfers\n\nAll payments are processed securely through our payment gateway.",
      ar: "نقبل طرق دفع متنوعة بما في ذلك:\n\n• بطاقات الائتمان/الخصم (فيزا، ماستركارد، أمريكان إكسبريس)\n• باي بال\n• آبل باي\n• جوجل باي\n• التحويلات المصرفية\n\nتتم معالجة جميع المدفوعات بشكل آمن من خلال بوابة الدفع الخاصة بنا."
    },
    keywords: ["payment", "pay", "credit card", "debit card", "paypal", "apple pay", "google pay"]
  },
  {
    id: "delivery-process",
    question: {
      en: "How does the delivery work?",
      ar: "كيف تعمل خدمة التوصيل؟"
    },
    answer: {
      en: "We offer convenient car delivery services:\n\n1. After booking, select the 'Delivery' option\n2. Enter your preferred delivery location and time\n3. Our team will deliver the car to your specified location\n4. At the end of your rental period, we can also pick up the car from your location\n\nDelivery is free within city limits. Additional fees may apply for locations outside the city.",
      ar: "نقدم خدمات توصيل السيارات المريحة:\n\n1. بعد الحجز، حدد خيار 'التوصيل'\n2. أدخل موقع وزمن التوصيل المفضل لديك\n3. سيقوم فريقنا بتوصيل السيارة إلى الموقع المحدد\n4. في نهاية فترة الإيجار، يمكننا أيضًا استلام السيارة من موقعك\n\nالتوصيل مجاني داخل حدود المدينة. قد تطبق رسوم إضافية للمواقع خارج المدينة."
    },
    keywords: ["delivery", "deliver", "pickup", "drop off", "transport"]
  },
  {
    id: "insurance-coverage",
    question: {
      en: "What insurance coverage is included?",
      ar: "ما هو التأمين المشمول؟"
    },
    answer: {
      en: "All our rentals include basic insurance coverage:\n\n• Collision Damage Waiver (CDW)\n• Third-party liability insurance\n• Theft protection\n\nYou can upgrade to our Premium insurance package for additional coverage including:\n• Zero excess/deductible\n• Tire and windshield coverage\n• Personal accident insurance\n\nDetails are provided during the booking process.",
      ar: "تشمل جميع إيجاراتنا تغطية تأمينية أساسية:\n\n• التنازل عن أضرار التصادم (CDW)\n• تأمين المسؤولية تجاه الطرف الثالث\n• الحماية من السرقة\n\nيمكنك الترقية إلى باقة التأمين المتميزة للحصول على تغطية إضافية تشمل:\n• صفر زيادة/خصم\n• تغطية الإطارات والزجاج الأمامي\n• تأمين الحوادث الشخصية\n\nيتم تقديم التفاصيل أثناء عملية الحجز."
    },
    keywords: ["insurance", "coverage", "protection", "damage", "accident"]
  },
  {
    id: "age-requirements",
    question: {
      en: "What are the age requirements for renting?",
      ar: "ما هي متطلبات العمر للإيجار؟"
    },
    answer: {
      en: "Our standard age requirements are:\n\n• Minimum age: 21 years\n• For luxury and sports cars: 25 years\n\nDrivers under 25 may be subject to a young driver surcharge. All drivers must have held their license for at least 1 year.",
      ar: "متطلبات العمر القياسية لدينا هي:\n\n• الحد الأدنى للعمر: 21 سنة\n• للسيارات الفاخرة والرياضية: 25 سنة\n\nقد يخضع السائقون الذين تقل أعمارهم عن 25 عامًا لرسوم إضافية للسائق الشاب. يجب أن يكون جميع السائقين قد حصلوا على رخصة القيادة لمدة سنة واحدة على الأقل."
    },
    keywords: ["age", "young driver", "requirements", "license", "driving license"]
  }
];

/**
 * Find a matching question based on user input
 * @param input User input text
 * @returns Matching question or undefined if no match found
 */
export const findMatchingQuestion = (input: string, language: 'en' | 'ar'): ChatbotQuestion | undefined => {
  // Convert input to lowercase for case-insensitive matching
  const normalizedInput = input.toLowerCase();
  
  // First try to match exact questions
  const exactMatch = chatbotQuestions.find(q => 
    q.question[language].toLowerCase() === normalizedInput
  );
  
  if (exactMatch) return exactMatch;
  
  // Then try to match by keywords
  return chatbotQuestions.find(q => 
    q.keywords.some(keyword => normalizedInput.includes(keyword.toLowerCase()))
  );
};

/**
 * Get a fallback response when no matching question is found
 * @returns Fallback response in the specified language
 */
export const getFallbackResponse = (language: 'en' | 'ar'): string => {
  const responses = {
    en: [
      "I'm not sure I understand. Could you rephrase your question?",
      "I don't have information on that yet. Would you like to ask something else?",
      "I'm still learning! Could you try asking another question?",
      "I couldn't find an answer to that. Please try one of the suggested questions."
    ],
    ar: [
      "لست متأكدًا من أنني أفهم. هل يمكنك إعادة صياغة سؤالك؟",
      "ليس لدي معلومات عن ذلك بعد. هل ترغب في طرح سؤال آخر؟",
      "ما زلت أتعلم! هل يمكنك محاولة طرح سؤال آخر؟",
      "لم أتمكن من العثور على إجابة لذلك. يرجى تجربة أحد الأسئلة المقترحة."
    ]
  };
  
  // Return a random fallback response
  const randomIndex = Math.floor(Math.random() * responses[language].length);
  return responses[language][randomIndex];
};
