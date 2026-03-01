import type { Domain } from './types';

export const mkpiDomains: Domain[] = [
  {
    id: '1',
    number: '1',
    name: 'Social and Emotional Competencies',
    subDomains: [
      {
        id: '1.1',
        number: '1.1',
        name: 'Self-Awareness',
        indicators: [
          {
            id: '1.1.1',
            number: '1.1',
            descriptor: 'Expresses thoughts and feelings appropriately through gestures, actions, drawing and/or words',
            helpText: 'Observe how the child communicates their emotions and thoughts through various modes of expression.',
          },
        ],
      },
      {
        id: '1.2',
        number: '1.2',
        name: 'Self-Management',
        indicators: [
          {
            id: '1.2.1',
            number: '1.2.1',
            descriptor: 'Asks for help when necessary, in an appropriate manner (knows who, when and how to ask for help)',
            helpText: 'Child demonstrates awareness of when they need assistance and approaches suitable adults or peers for help.',
          },
          {
            id: '1.2.2',
            number: '1.2.2',
            descriptor: 'Carries out developmentally appropriate daily personal and classroom tasks independently',
            helpText: 'Child can manage routine tasks such as packing bags, cleaning up, and following daily schedules.',
          },
        ],
      },
      {
        id: '1.3',
        number: '1.3',
        name: 'Self-Regulation',
        indicators: [
          {
            id: '1.3.1',
            number: '1.3.1',
            descriptor: 'Demonstrates appropriate classroom and social behaviours in group settings',
            helpText: 'Child follows group norms such as taking turns, listening when others speak, and participating cooperatively.',
          },
          {
            id: '1.3.2',
            number: '1.3.2',
            descriptor: 'Uses basic strategies to manage emotions and behaviours with prompting from adults',
            helpText: 'With guidance, child can calm down, wait, or redirect their behaviour when experiencing strong emotions.',
          },
        ],
      },
      {
        id: '1.4',
        number: '1.4',
        name: 'Social Awareness and Relationship Building',
        indicators: [
          {
            id: '1.4.1',
            number: '1.4.1',
            descriptor: 'Gets along and interacts well with other children',
            helpText: 'Child engages positively with peers during play and group activities.',
          },
          {
            id: '1.4.2',
            number: '1.4.2',
            descriptor: "Shows care and concern in response to others' needs and feelings",
            helpText: 'Child demonstrates empathy by recognising and responding to emotions of others.',
          },
        ],
      },
      {
        id: '1.5',
        number: '1.5',
        name: 'Taking Responsibility for their Actions',
        indicators: [
          {
            id: '1.5.1',
            number: '1.5.1',
            descriptor: 'Makes choices based on what is the right thing to do and will not follow others who are doing the wrong thing',
            helpText: 'Child shows moral awareness and can resist peer pressure to do wrong.',
          },
          {
            id: '1.5.2',
            number: '1.5.2',
            descriptor: 'Willing to admit his/her own mistake and work with an adult to improve',
            helpText: 'Child takes ownership of mistakes and is open to guidance for improvement.',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    number: '2',
    name: 'Learning Dispositions',
    subDomains: [
      {
        id: '2.1',
        number: '2.1',
        name: 'Perseverance',
        indicators: [
          {
            id: '2.1.1',
            number: '2.1',
            descriptor: 'Keeps on working at a task to complete it without giving up easily even when faced with difficulties',
            helpText: 'Child demonstrates persistence and resilience when encountering challenges.',
          },
        ],
      },
      {
        id: '2.2',
        number: '2.2',
        name: 'Reflectiveness',
        indicators: [
          {
            id: '2.2.1',
            number: '2.2',
            descriptor: 'Recalls and applies what worked well previously or make adjustments to improve on previous ideas/experiences in responding to new situations',
            helpText: 'Child can draw on past experiences to inform current actions and decisions.',
          },
        ],
      },
      {
        id: '2.3',
        number: '2.3',
        name: 'Appreciation',
        indicators: [
          {
            id: '2.3.1',
            number: '2.3',
            descriptor: 'Shows openness in accepting the ideas/views of others, even when they are different from his/her own',
            helpText: 'Child respects diverse perspectives and is willing to consider alternative viewpoints.',
          },
        ],
      },
      {
        id: '2.4',
        number: '2.4',
        name: 'Inventiveness',
        indicators: [
          {
            id: '2.4.1',
            number: '2.4',
            descriptor: 'Suggests and explores different ways to solve a problem',
            helpText: 'Child demonstrates creative thinking and problem-solving by proposing multiple approaches.',
          },
        ],
      },
      {
        id: '2.5',
        number: '2.5',
        name: 'Sense of Wonder and Curiosity',
        indicators: [
          {
            id: '2.5.1',
            number: '2.5',
            descriptor: 'Asks questions about why things happen and how things work',
            helpText: 'Child shows natural curiosity by asking thoughtful questions about the world around them.',
          },
        ],
      },
      {
        id: '2.6',
        number: '2.6',
        name: 'Engagement',
        indicators: [
          {
            id: '2.6.1',
            number: '2.6',
            descriptor: 'Stays focused in a variety of activities for extended periods of time and would return to the activity even after being momentarily distracted',
            helpText: 'Child shows sustained attention and can refocus after brief interruptions.',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    number: '3',
    name: 'Aesthetics and Creative Expression',
    subDomains: [
      {
        id: '3.1',
        number: '3.1',
        name: 'Interest in Art and Music and Movement',
        indicators: [
          {
            id: '3.1.1',
            number: '3.1.1',
            descriptor: 'Shows enjoyment through active participation in art activities',
            helpText: 'Child willingly engages in drawing, painting, crafting and other art activities.',
          },
          {
            id: '3.1.2',
            number: '3.1.2',
            descriptor: 'Shows enjoyment through active participation in music and movement activities',
            helpText: 'Child actively participates in singing, dancing, and rhythmic activities.',
          },
        ],
      },
      {
        id: '3.2',
        number: '3.2',
        name: 'Expression of Ideas and Feelings through Art and Music and Movement',
        indicators: [
          {
            id: '3.2.1',
            number: '3.2.1',
            descriptor: 'Shows creativity and imagination in using elements of art to express ideas and feelings',
            helpText: 'Child uses art materials creatively to communicate thoughts and emotions.',
          },
          {
            id: '3.2.2',
            number: '3.2.2',
            descriptor: 'Shows creativity and imagination in using elements of music to express ideas and feelings',
            helpText: 'Child uses musical elements creatively for self-expression.',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    number: '4',
    name: 'Discovery of the World',
    subDomains: [
      {
        id: '4.1',
        number: '4.1',
        name: 'Process Skills',
        indicators: [
          {
            id: '4.1.1',
            number: '4.1',
            descriptor: 'Makes sense of and communicates his/her observations about living things, places and events around him/her',
            helpText: 'Child observes surroundings and can share what they notice about the natural and social world.',
          },
        ],
      },
      {
        id: '4.2',
        number: '4.2',
        name: 'Care and Respect for the World around them',
        indicators: [
          {
            id: '4.2.1',
            number: '4.2',
            descriptor: 'Shows care and respect for the world around them, including living and non-living things',
            helpText: 'Child demonstrates environmental awareness and treats living things and objects with care.',
          },
        ],
      },
    ],
  },
  {
    id: '5',
    number: '5',
    name: 'Health, Safety and Motor Skills Development',
    subDomains: [
      {
        id: '5.1',
        number: '5.1',
        name: 'General Dispositions towards Physical Activities',
        indicators: [
          {
            id: '5.1.1',
            number: '5.1',
            descriptor: 'Shows enjoyment through active participation in both indoor and outdoor physical activities',
            helpText: 'Child enthusiastically joins in physical play and exercises.',
          },
        ],
      },
      {
        id: '5.2',
        number: '5.2',
        name: 'Hygiene',
        indicators: [
          {
            id: '5.2.1',
            number: '5.2',
            descriptor: 'Shows a sense of social responsibility in having good personal hygiene and keeping shared spaces clean',
            helpText: 'Child practises good hygiene habits and contributes to keeping common areas tidy.',
          },
        ],
      },
      {
        id: '5.3',
        number: '5.3',
        name: 'Gross Motor Skills',
        indicators: [
          {
            id: '5.3.1',
            number: '5.3',
            descriptor: 'Shows confidence to attempt a variety of gross motor tasks',
            helpText: 'Child willingly tries activities involving large body movements like running, jumping, and climbing.',
          },
        ],
      },
      {
        id: '5.4',
        number: '5.4',
        name: 'Fine Motor Skills',
        indicators: [
          {
            id: '5.4.1',
            number: '5.4',
            descriptor: 'Shows good eye-hand coordination in doing a variety of fine motor tasks',
            helpText: 'Child handles small objects with control, such as writing, cutting, and threading.',
          },
        ],
      },
      {
        id: '5.5',
        number: '5.5',
        name: 'Safety',
        indicators: [
          {
            id: '5.5.1',
            number: '5.5',
            descriptor: 'Shows awareness of keeping self and others safe across different settings',
            helpText: 'Child recognises potential dangers and follows safety rules in various environments.',
          },
        ],
      },
    ],
  },
  {
    id: '6A',
    number: '6A',
    name: 'Language and Literacy (EL)',
    subDomains: [
      {
        id: '6A.1',
        number: '6A.1',
        name: 'Disposition towards EL',
        indicators: [
          {
            id: '6A.1.1',
            number: '6A.1',
            descriptor: 'Shows initiative to pick up reading materials, including stories, rhymes, information books e.t.c.',
            helpText: 'Child independently chooses and engages with English reading materials.',
          },
        ],
      },
      {
        id: '6A.2',
        number: '6A.2',
        name: 'Listening & Speaking Skills',
        indicators: [
          {
            id: '6A.2.1',
            number: '6A.2.1',
            descriptor: 'Understands and follows two-step verbal instructions',
            helpText: 'Child can carry out two consecutive instructions given verbally in English.',
          },
          {
            id: '6A.2.2',
            number: '6A.2.2',
            descriptor: 'Gives a verbal response to questions',
            helpText: 'Child responds appropriately when asked questions in English.',
          },
          {
            id: '6A.2.3',
            number: '6A.2.3',
            descriptor: 'Speaks to express thoughts and ideas using simple phrases, sentences or questions',
            helpText: 'Child can form and use basic English sentences to communicate.',
          },
        ],
      },
      {
        id: '6A.3',
        number: '6A.3',
        name: 'Early Reading and Writing Skills',
        indicators: [
          {
            id: '6A.3.1',
            number: '6A.3.1',
            descriptor: 'Knows concepts about print',
            helpText: 'Child understands basic print concepts such as reading direction and that print carries meaning.',
          },
          {
            id: '6A.3.2',
            number: '6A.3.2',
            descriptor: 'Names all letters of the alphabet in upper and lowercase',
            helpText: 'Child can identify and name all 26 letters in both cases.',
          },
          {
            id: '6A.3.3',
            number: '6A.3.3',
            descriptor: 'Knows letter-sound correspondences that have been taught to him/her',
            helpText: 'Child can associate letters with their corresponding sounds (phonics).',
          },
          {
            id: '6A.3.4',
            number: '6A.3.4',
            descriptor: 'Attempts to read words consistent with letter-sound correspondence knowledge by blending sounds',
            helpText: 'Child tries to sound out and read simple words by blending letter sounds.',
          },
          {
            id: '6A.3.5',
            number: '6A.3.5',
            descriptor: 'Recognises and writes own name with the correct writing conventions',
            helpText: 'Child can write their own name using proper letter formation and capitalisation.',
          },
          {
            id: '6A.3.6',
            number: '6A.3.6',
            descriptor: 'Demonstrates copying and/or writing abilities',
            helpText: 'Child can copy text and attempt independent writing of letters and words.',
          },
        ],
      },
    ],
  },
  {
    id: '6B',
    number: '6B',
    name: 'Language and Literacy (MTL)',
    subDomains: [
      {
        id: '6B.1',
        number: '6B.1',
        name: 'Disposition towards MTL',
        indicators: [
          {
            id: '6B.1.1',
            number: '6B.1.1',
            descriptor: 'Shows enjoyment in listening to stories, songs and rhymes and shows initiative during MTL activities',
            helpText: 'Child actively engages with Mother Tongue Language stories, songs and learning activities.',
          },
          {
            id: '6B.1.2',
            number: '6B.1.2',
            descriptor: 'Shows enjoyment in participating in cultural activities',
            helpText: 'Child willingly participates in cultural celebrations and activities related to their Mother Tongue.',
          },
        ],
      },
      {
        id: '6B.2',
        number: '6B.2',
        name: 'Listening and Speaking Skills',
        indicators: [
          {
            id: '6B.2.1',
            number: '6B.2.1',
            descriptor: 'Understands and follows one- to two-step verbal instructions',
            helpText: 'Child can carry out instructions given verbally in their Mother Tongue Language.',
          },
          {
            id: '6B.2.2',
            number: '6B.2.2',
            descriptor: 'Understands and engages in daily conversations',
            helpText: 'Child can understand and participate in everyday conversations in their Mother Tongue.',
          },
          {
            id: '6B.2.3',
            number: '6B.2.3',
            descriptor: 'Speaks to express thoughts and ideas using simple phrases, sentences or questions',
            helpText: 'Child can form and use basic Mother Tongue sentences to communicate.',
          },
        ],
      },
      {
        id: '6B.3',
        number: '6B.3',
        name: 'Early Reading and Writing Skills',
        indicators: [
          {
            id: '6B.3.1',
            number: '6B.3.1',
            descriptor: 'Recognises letters (TL) OR characters (CL) OR words (ML) that have been taught',
            helpText: 'Child can identify Mother Tongue letters, characters, or words that they have learned.',
          },
          {
            id: '6B.3.2',
            number: '6B.3.2',
            descriptor: 'Makes marks, draws symbols and writes letters/characters and/or words to represent ideas',
            helpText: 'Child attempts to write in their Mother Tongue to express meaning.',
          },
        ],
      },
    ],
  },
  {
    id: '7',
    number: '7',
    name: 'Numeracy',
    subDomains: [
      {
        id: '7.1',
        number: '7.1',
        name: 'Relationships and Patterns',
        indicators: [
          {
            id: '7.1.1',
            number: '7.1.1',
            descriptor: 'Matches, sorts and compares things by one or more attributes',
            helpText: 'Child can group and compare objects based on characteristics like colour, shape, or size.',
          },
          {
            id: '7.1.2',
            number: '7.1.2',
            descriptor: 'Puts things in an order according to size, length and sequence of events',
            helpText: 'Child can arrange objects in order and sequence events chronologically.',
          },
          {
            id: '7.1.3',
            number: '7.1.3',
            descriptor: 'Recognises, describes and creates simple patterns',
            helpText: 'Child can identify, talk about, and make patterns using objects, colours, or shapes.',
          },
        ],
      },
      {
        id: '7.2',
        number: '7.2',
        name: 'Counting Skills and Number Sense',
        indicators: [
          {
            id: '7.2.1',
            number: '7.2.1',
            descriptor: 'Counts accurately up to at least 10 objects',
            helpText: 'Child can correctly count physical objects up to 10 with one-to-one correspondence.',
          },
          {
            id: '7.2.2',
            number: '7.2.2',
            descriptor: 'Recognises numbers from 1 to 10 in numerals and words',
            helpText: 'Child can identify and read numbers 1-10 in both numeral and word form.',
          },
          {
            id: '7.2.3',
            number: '7.2.3',
            descriptor: 'Matches number name, numeral and number word to the quantity of a set of up to 10 things',
            helpText: 'Child can connect spoken numbers, written numerals, and number words to actual quantities.',
          },
          {
            id: '7.2.4',
            number: '7.2.4',
            descriptor: 'Writes numbers 1 to 10 in numerals',
            helpText: 'Child can write numerals 1-10 with correct formation.',
          },
          {
            id: '7.2.5',
            number: '7.2.5',
            descriptor: "Compares the quantities of two sets of up to 10 things each and use 'same as', 'more than', 'fewer than' and 'less than' appropriately",
            helpText: 'Child can compare two groups of objects and use comparison vocabulary correctly.',
          },
          {
            id: '7.2.6',
            number: '7.2.6',
            descriptor: 'Names the parts that form the whole in a quantity of up to 10 (e.g. 5 is made up of 2 and 3; and 1 and 4)',
            helpText: 'Child understands number bonds and can decompose numbers up to 10.',
          },
        ],
      },
      {
        id: '7.3',
        number: '7.3',
        name: 'Basic Shapes and Spatial Concepts',
        indicators: [
          {
            id: '7.3.1',
            number: '7.3.1',
            descriptor: 'Recognises and uses basic shapes to form other figures',
            helpText: 'Child can identify basic shapes and combine them to create new figures.',
          },
          {
            id: '7.3.2',
            number: '7.3.2',
            descriptor: 'Attempts to use spatial concepts such as position (top/bottom; in front of/behind) direction (up/down; left/right) and distance (far/near) in their daily lives',
            helpText: 'Child uses spatial language and concepts in everyday activities and conversations.',
          },
        ],
      },
    ],
  },
];

// Helper to get all indicators as a flat list
export function getAllIndicators(): { id: string; descriptor: string; domainName: string; subDomainName: string }[] {
  const indicators: { id: string; descriptor: string; domainName: string; subDomainName: string }[] = [];
  for (const domain of mkpiDomains) {
    for (const subDomain of domain.subDomains) {
      for (const indicator of subDomain.indicators) {
        indicators.push({
          id: indicator.id,
          descriptor: indicator.descriptor,
          domainName: domain.name,
          subDomainName: subDomain.name,
        });
      }
    }
  }
  return indicators;
}

// Helper to get all indicator IDs
export function getAllIndicatorIds(): string[] {
  return getAllIndicators().map(i => i.id);
}

// Helper to create empty indicator values
export function createEmptyIndicatorValues(): Record<string, null> {
  const values: Record<string, null> = {};
  for (const id of getAllIndicatorIds()) {
    values[id] = null;
  }
  return values;
}
