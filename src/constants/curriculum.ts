export interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
}

export interface GrammarItem {
  title: string;
  explanation: string;
  formula: string;
  examples: string[];
}

export interface UnitContent {
  unit: number;
  title: string;
  vocabulary: VocabularyItem[];
  grammar: GrammarItem[];
}

export interface GradeCurriculum {
  grade: number;
  units: UnitContent[];
}

export const CURRICULUM: GradeCurriculum[] = [
  {
    grade: 10,
    units: [
      {
        unit: 1,
        title: "Family Life",
        vocabulary: [
          { word: "Household chores", meaning: "Công việc nhà", example: "We divide the household chores equally in our family." },
          { word: "Breadwinner", meaning: "Trụ cột gia đình", example: "My father is the main breadwinner of the family." },
          { word: "Homemaker", meaning: "Người nội trợ", example: "She decided to be a homemaker to take care of her children." },
          { word: "Heavy lifting", meaning: "Việc nặng nhọc", example: "My brother usually does the heavy lifting in the house." },
          { word: "Nurture", meaning: "Nuôi dưỡng", example: "Parents should nurture their children's talents." },
          { word: "Responsibility", meaning: "Trách nhiệm", example: "Taking care of the pets is my responsibility." },
          { word: "Gratitude", meaning: "Lòng biết ơn", example: "Children should show gratitude to their parents." },
          { word: "Strengthen", meaning: "Làm cho mạnh thêm", example: "Doing chores together helps strengthen family bonds." },
          { word: "Manners", meaning: "Cách cư xử", example: "It is important to teach children good manners." }
        ],
        grammar: [
          {
            title: "Present Simple vs. Present Continuous",
            explanation: "Thì hiện tại đơn dùng cho thói quen, sự thật hiển nhiên. Hiện tại tiếp diễn dùng cho hành động đang xảy ra tại thời điểm nói hoặc kế hoạch trong tương lai gần.",
            formula: "Present Simple: S + V(s/es) | Present Continuous: S + am/is/are + V-ing",
            examples: [
              "I clean the house every day.",
              "I am cleaning the house now.",
              "My mother usually cooks dinner, but today my father is cooking.",
              "Water boils at 100 degrees Celsius."
            ]
          }
        ]
      },
      {
        unit: 2,
        title: "Humans and the Environment",
        vocabulary: [
          { word: "Eco-friendly", meaning: "Thân thiện với môi trường", example: "Using eco-friendly products helps save the planet." },
          { word: "Carbon footprint", meaning: "Dấu chân carbon", example: "Planting trees can reduce your carbon footprint." },
          { word: "Sustainable", meaning: "Bền vững", example: "We need to find sustainable ways to live." },
          { word: "Pollution", meaning: "Sự ô nhiễm", example: "Air pollution is a major problem in big cities." },
          { word: "Environmentally friendly", meaning: "Thân thiện với môi trường", example: "We should use environmentally friendly light bulbs." },
          { word: "Adopt", meaning: "Áp dụng, chọn theo", example: "More people are adopting a green lifestyle." },
          { word: "Awareness", meaning: "Sự nhận thức", example: "The campaign aims to raise awareness about plastic waste." },
          { word: "Conserve", meaning: "Bảo tồn, tiết kiệm", example: "We must conserve water and electricity." },
          { word: "Resource", meaning: "Tài nguyên", example: "Natural resources are limited." }
        ],
        grammar: [
          {
            title: "Will vs. Be going to",
            explanation: "Will dùng cho quyết định tức thời, dự đoán không căn cứ hoặc lời hứa. Be going to dùng cho dự định đã có từ trước hoặc dự đoán có căn cứ ở hiện tại.",
            formula: "S + will + V | S + am/is/are + going to + V",
            examples: [
              "I think it will rain tomorrow.",
              "Look at those black clouds! It is going to rain.",
              "I will help you with the trash.",
              "I am going to join a green club next week."
            ]
          }
        ]
      },
      {
        unit: 3,
        title: "Music",
        vocabulary: [
          { word: "Talented", meaning: "Tài năng", example: "She is a very talented musician." },
          { word: "Audience", meaning: "Khán giả", example: "The audience cheered loudly after the performance." },
          { word: "Instrument", meaning: "Nhạc cụ", example: "What musical instrument can you play?" },
          { word: "Performance", meaning: "Buổi biểu diễn", example: "The performance was amazing." },
          { word: "Contestant", meaning: "Thí sinh", example: "The contestants are waiting for the results." },
          { word: "Judge", meaning: "Giám khảo", example: "The judges were impressed by his voice." },
          { word: "Eliminate", meaning: "Loại bỏ", example: "He was eliminated from the competition in the second round." },
          { word: "Release", meaning: "Phát hành", example: "The band will release their new album next month." },
          { word: "Fan", meaning: "Người hâm mộ", example: "She is a big fan of K-pop music." }
        ],
        grammar: [
          {
            title: "Compound Sentences",
            explanation: "Câu ghép được tạo thành từ hai hoặc nhiều mệnh đề độc lập nối với nhau bằng liên từ (FANBOYS: for, and, nor, but, or, yet, so).",
            formula: "Independent Clause + , + Conjunction + Independent Clause",
            examples: [
              "I like pop music, but my sister likes rock.",
              "He practiced hard, so he won the competition.",
              "You can go to the concert, or you can stay at home.",
              "She is a talented singer, and she plays the piano well."
            ]
          }
        ]
      },
      {
        unit: 4,
        title: "For a Better Community",
        vocabulary: [
          { word: "Volunteer", meaning: "Tình nguyện viên", example: "Many students volunteer at the local orphanage." },
          { word: "Contribution", meaning: "Sự đóng góp", example: "We appreciate your contribution to the charity." },
          { word: "Community", meaning: "Cộng đồng", example: "We should work together for a better community." },
          { word: "Charity", meaning: "Từ thiện", example: "They raised a lot of money for charity." },
          { word: "Disadvantaged", meaning: "Thiệt thòi", example: "The program helps disadvantaged children in remote areas." },
          { word: "Meaningful", meaning: "Có ý nghĩa", example: "Volunteering is a meaningful activity." },
          { word: "Interact", meaning: "Tương tác", example: "Volunteers have a chance to interact with different people." },
          { word: "Remote", meaning: "Xa xôi, hẻo lánh", example: "They built a school in a remote village." },
          { word: "Generous", meaning: "Hào phóng", example: "He is very generous with his time and money." }
        ],
        grammar: [
          {
            title: "Past Simple vs. Past Continuous with When/While",
            explanation: "Dùng để diễn tả một hành động đang xảy ra (quá khứ tiếp diễn) thì có hành động khác xen vào (quá khứ đơn).",
            formula: "When + Past Simple, Past Continuous | While + Past Continuous, Past Simple",
            examples: [
              "When I arrived, they were having dinner.",
              "While I was walking home, it started to rain.",
              "They were cleaning the beach when the storm came.",
              "I saw an old friend while I was volunteering at the hospital."
            ]
          }
        ]
      },
      {
        unit: 5,
        title: "Inventions",
        vocabulary: [
          { word: "Invention", meaning: "Sự phát minh", example: "The light bulb is a great invention." },
          { word: "Portable", meaning: "Có thể mang theo", example: "Laptops are portable computers." },
          { word: "Economical", meaning: "Tiết kiệm", example: "This car is very economical on fuel." },
          { word: "Device", meaning: "Thiết bị", example: "A smartphone is a versatile device." },
          { word: "Versatile", meaning: "Đa năng", example: "This tool is very versatile; you can use it for many things." },
          { word: "Benefit", meaning: "Lợi ích", example: "Modern inventions bring many benefits to our lives." },
          { word: "Submarine", meaning: "Tàu ngầm", example: "Submarines can travel deep under the ocean." },
          { word: "Laboratory", meaning: "Phòng thí nghiệm", example: "Scientists work in the laboratory to test new ideas." },
          { word: "Patent", meaning: "Bằng sáng chế", example: "He applied for a patent for his new invention." }
        ],
        grammar: [
          {
            title: "Gerunds and Infinitives",
            explanation: "Danh động từ (V-ing) và động từ nguyên mẫu (to V) được dùng sau một số động từ hoặc cấu trúc nhất định.",
            formula: "V + V-ing | V + to V | For + V-ing (purpose) | To + V (purpose)",
            examples: [
              "I enjoy listening to music.",
              "I want to travel around the world.",
              "Laptops are used for studying and working.",
              "We use smartphones to connect with friends."
            ]
          }
        ]
      },
      {
        unit: 6,
        title: "Gender Equality",
        vocabulary: [
          { word: "Gender equality", meaning: "Bình đẳng giới", example: "Gender equality is a fundamental human right." },
          { word: "Discrimination", meaning: "Sự phân biệt đối xử", example: "We must eliminate all forms of discrimination against women." },
          { word: "Enrol", meaning: "Đăng ký học", example: "More girls are enrolling in schools now." },
          { word: "Opportunity", meaning: "Cơ hội", example: "Everyone should have equal opportunities for education." },
          { word: "Eliminate", meaning: "Loại bỏ", example: "We need to eliminate poverty and hunger." },
          { word: "Preference", meaning: "Sự ưu tiên", example: "Some parents still have a preference for boys." },
          { word: "Force", meaning: "Bắt buộc", example: "Girls shouldn't be forced to get married at a young age." },
          { word: "Domestic violence", meaning: "Bạo lực gia đình", example: "Domestic violence is a serious social problem." },
          { word: "Wage", meaning: "Tiền lương", example: "Women often earn lower wages than men for the same job." }
        ],
        grammar: [
          {
            title: "Passive Voice with Modals",
            explanation: "Câu bị động dùng để nhấn mạnh hành động hơn là người thực hiện. Với động từ khiếm khuyết, ta dùng modal + be + V3/ed.",
            formula: "S + modal (can/must/should...) + be + V3/ed",
            examples: [
              "Gender discrimination should be eliminated.",
              "Equal opportunities must be provided to everyone.",
              "This problem can be solved easily.",
              "More schools will be built in rural areas."
            ]
          }
        ]
      },
      {
        unit: 7,
        title: "Viet Nam and International Organisations",
        vocabulary: [
          { word: "Organisation", meaning: "Tổ chức", example: "Viet Nam joined the United Nations in 1977." },
          { word: "Peacekeeping", meaning: "Gìn giữ hòa bình", example: "Viet Nam participates in UN peacekeeping missions." },
          { word: "Economic", meaning: "Thuộc về kinh tế", example: "International trade promotes economic growth." },
          { word: "Commitment", meaning: "Sự cam kết", example: "Viet Nam has a strong commitment to regional stability." },
          { word: "Promote", meaning: "Thúc đẩy", example: "The organisation aims to promote cultural exchange." },
          { word: "Technical", meaning: "Thuộc về kỹ thuật", example: "They provide technical support to developing countries." },
          { word: "Relationship", meaning: "Mối quan hệ", example: "Viet Nam has established diplomatic relationships with many countries." },
          { word: "Investment", meaning: "Sự đầu tư", example: "Foreign investment is important for our economy." },
          { word: "Expert", meaning: "Chuyên gia", example: "The UN sent experts to help with the project." }
        ],
        grammar: [
          {
            title: "Comparative and Superlative Adjectives",
            explanation: "So sánh hơn dùng để so sánh 2 đối tượng. So sánh nhất dùng để so sánh 1 đối tượng với cả nhóm (từ 3 trở lên).",
            formula: "Comparative: Short adj + er / more + long adj | Superlative: the + short adj + est / the + most + long adj",
            examples: [
              "Viet Nam is becoming more active in the UN.",
              "This is the largest organisation in the world.",
              "English is more popular than French.",
              "He is the tallest student in my class."
            ]
          }
        ]
      },
      {
        unit: 8,
        title: "New Ways to Learn",
        vocabulary: [
          { word: "Blended learning", meaning: "Học tập kết hợp", example: "Blended learning combines face-to-face and online learning." },
          { word: "Digital", meaning: "Kỹ thuật số", example: "Digital tools are essential for modern education." },
          { word: "Strategy", meaning: "Chiến lược", example: "Students need effective learning strategies." },
          { word: "Access", meaning: "Truy cập", example: "The internet allows us to access a lot of information." },
          { word: "Distance learning", meaning: "Học từ xa", example: "Distance learning is convenient for busy people." },
          { word: "Interactive", meaning: "Tương tác", example: "Online lessons should be more interactive." },
          { word: "Platform", meaning: "Nền tảng", example: "We use an online platform to submit our homework." },
          { word: "Concentrate", meaning: "Tập trung", example: "It's hard to concentrate when there is too much noise." },
          { word: "Device", meaning: "Thiết bị", example: "Electronic devices can be used for learning." }
        ],
        grammar: [
          {
            title: "Relative Clauses: Who, Which, That",
            explanation: "Mệnh đề quan hệ dùng để bổ nghĩa cho danh từ đứng trước nó. 'Who' dùng cho người, 'Which' dùng cho vật, 'That' dùng cho cả người và vật.",
            formula: "Noun + who/which/that + S + V",
            examples: [
              "The teacher who taught me is very kind.",
              "The app which I use is very helpful.",
              "The book that you gave me is interesting.",
              "I know a girl who can speak four languages."
            ]
          }
        ]
      },
      {
        unit: 9,
        title: "Protecting the Environment",
        vocabulary: [
          { word: "Pollution", meaning: "Sự ô nhiễm", example: "Air pollution is a major problem in big cities." },
          { word: "Endangered", meaning: "Đang gặp nguy hiểm", example: "We must protect endangered animals." },
          { word: "Preserve", meaning: "Bảo tồn", example: "It's important to preserve our natural resources." },
          { word: "Habitat", meaning: "Môi trường sống", example: "Loss of habitat is the biggest threat to wildlife." },
          { word: "Biodiversity", meaning: "Đa dạng sinh học", example: "Biodiversity is essential for a healthy ecosystem." },
          { word: "Ecosystem", meaning: "Hệ sinh thái", example: "Pollution can damage the whole ecosystem." },
          { word: "Extinct", meaning: "Tuyệt chủng", example: "Many species are at risk of becoming extinct." },
          { word: "Global warming", meaning: "Sự nóng lên toàn cầu", example: "Global warming is causing sea levels to rise." },
          { word: "Toxic", meaning: "Độc hại", example: "Toxic chemicals should be disposed of carefully." }
        ],
        grammar: [
          {
            title: "Reported Speech: Statements",
            explanation: "Dùng để thuật lại lời nói của ai đó. Khi động từ tường thuật ở quá khứ (said, told), ta phải lùi thì của động từ trong câu trực tiếp.",
            formula: "S + said (that) + S + V (lùi thì)",
            examples: [
              "He said: 'I love nature' -> He said that he loved nature.",
              "She said: 'I am planting trees' -> She said she was planting trees.",
              "They said: 'We will clean the beach' -> They said they would clean the beach.",
              "Nam told me: 'I have finished my project' -> Nam told me he had finished his project."
            ]
          }
        ]
      },
      {
        unit: 10,
        title: "Ecotourism",
        vocabulary: [
          { word: "Ecotourism", meaning: "Du lịch sinh thái", example: "Ecotourism helps protect the environment." },
          { word: "Sustainable", meaning: "Bền vững", example: "We should promote sustainable tourism." },
          { word: "Awareness", meaning: "Sự nhận thức", example: "The tour aims to raise environmental awareness." },
          { word: "Destination", meaning: "Điểm đến", example: "Da Lat is a popular tourist destination." },
          { word: "Impact", meaning: "Tác động", example: "Tourism can have a negative impact on local culture." },
          { word: "Responsible", meaning: "Có trách nhiệm", example: "We should be responsible tourists." },
          { word: "Flora and fauna", meaning: "Hệ thực vật và động vật", example: "The national park has a diverse range of flora and fauna." },
          { word: "Benefit", meaning: "Lợi ích", example: "Ecotourism brings benefits to local communities." },
          { word: "Damage", meaning: "Gây hại", example: "Be careful not to damage the coral reefs." }
        ],
        grammar: [
          {
            title: "Conditional Sentences Type 1 & 2",
            explanation: "Loại 1: Diễn tả điều kiện có thể xảy ra ở hiện tại hoặc tương lai. Loại 2: Diễn tả điều kiện không có thật ở hiện tại.",
            formula: "Type 1: If + S + V(s/es), S + will + V | Type 2: If + S + V2/ed, S + would + V",
            examples: [
              "If we protect the forest, the animals will survive.",
              "If I were you, I would join the green club.",
              "If it rains tomorrow, we will stay at home.",
              "If I had a lot of money, I would travel around the world."
            ]
          }
        ]
      },
      {
        unit: 11,
        title: "Modern Technology",
        vocabulary: [
          { word: "Artificial Intelligence", meaning: "Trí tuệ nhân tạo", example: "AI is changing the way we live and work." },
          { word: "Gadget", meaning: "Thiết bị điện tử nhỏ", example: "He loves buying the latest electronic gadgets." },
          { word: "Virtual Reality", meaning: "Thực tế ảo", example: "VR can be used for training and entertainment." },
          { word: "Breakthrough", meaning: "Bước đột phá", example: "Scientists have made a breakthrough in cancer research." },
          { word: "Revolutionize", meaning: "Cách mạng hóa", example: "The internet has revolutionized communication." },
          { word: "Automation", meaning: "Sự tự động hóa", example: "Automation can increase productivity in factories." },
          { word: "High-tech", meaning: "Công nghệ cao", example: "They use high-tech equipment to monitor the weather." },
          { word: "User-friendly", meaning: "Thân thiện với người dùng", example: "The new software is very user-friendly." },
          { word: "Innovation", meaning: "Sự đổi mới", example: "Innovation is key to economic growth." }
        ],
        grammar: [
          {
            title: "Relative Clauses with Prepositions",
            explanation: "Khi đại từ quan hệ (which/whom) làm tân ngữ của giới từ, giới từ có thể đứng trước đại từ quan hệ (trang trọng) hoặc đứng sau động từ.",
            formula: "Noun + preposition + which/whom + S + V",
            examples: [
              "The company for which he works is very famous.",
              "The man to whom I spoke was very helpful.",
              "The house in which I live is very old.",
              "The project on which they are working is important."
            ]
          }
        ]
      },
      {
        unit: 12,
        title: "Future Jobs",
        vocabulary: [
          { word: "Automation", meaning: "Sự tự động hóa", example: "Automation may replace many manual jobs in the future." },
          { word: "Soft skills", meaning: "Kỹ năng mềm", example: "Communication and teamwork are important soft skills." },
          { word: "Telecommuting", meaning: "Làm việc từ xa", example: "Telecommuting allows people to work from home." },
          { word: "Artificial Intelligence", meaning: "Trí tuệ nhân tạo", example: "AI will create new types of jobs." },
          { word: "Career path", meaning: "Con đường sự nghiệp", example: "You should plan your career path carefully." },
          { word: "Job market", meaning: "Thị trường việc làm", example: "The job market is becoming more competitive." },
          { word: "Requirement", meaning: "Yêu cầu", example: "What are the requirements for this position?" },
          { word: "Qualification", meaning: "Bằng cấp, trình độ", example: "He has all the necessary qualifications for the job." },
          { word: "Entrepreneur", meaning: "Doanh nhân", example: "She is a successful entrepreneur." }
        ],
        grammar: [
          {
            title: "Review of Tenses",
            explanation: "Ôn tập các thì quan trọng: Hiện tại đơn, Hiện tại tiếp diễn, Hiện tại hoàn thành, Quá khứ đơn, Tương lai đơn.",
            formula: "Various tenses",
            examples: [
              "I have been learning English for five years.",
              "She will be working at this time tomorrow.",
              "They had finished the report before the meeting started.",
              "He usually goes to work by bus."
            ]
          }
        ]
      }
    ]
  },
  {
    grade: 11,
    units: [
      {
        unit: 1,
        title: "A Long and Healthy Life",
        vocabulary: [
          { word: "Longevity", meaning: "Sự trường thọ", example: "Healthy diet contributes to longevity." },
          { word: "Nutritious", meaning: "Bổ dưỡng", example: "Vegetables are very nutritious." },
          { word: "Immune system", meaning: "Hệ miễn dịch", example: "Exercise strengthens your immune system." },
          { word: "Life expectancy", meaning: "Tuổi thọ trung bình", example: "Life expectancy has increased significantly over the last century." },
          { word: "Balanced diet", meaning: "Chế độ ăn cân bằng", example: "A balanced diet is essential for good health." },
          { word: "Workout", meaning: "Buổi tập thể dục", example: "I have a regular workout at the gym." },
          { word: "Antibiotics", meaning: "Thuốc kháng sinh", example: "You should only take antibiotics when prescribed by a doctor." },
          { word: "Bacteria", meaning: "Vi khuẩn", example: "Some bacteria are beneficial to our health." },
          { word: "Organism", meaning: "Sinh vật", example: "The human body is a complex organism." }
        ],
        grammar: [
          {
            title: "Past Simple vs. Present Perfect",
            explanation: "Quá khứ đơn dùng cho hành động đã kết thúc tại thời điểm xác định trong quá khứ. Hiện tại hoàn thành dùng cho hành động bắt đầu trong quá khứ và còn tiếp tục đến hiện tại, hoặc vừa mới xảy ra.",
            formula: "Past Simple: S + V2/ed | Present Perfect: S + have/has + V3/ed",
            examples: [
              "I exercised yesterday.",
              "I have exercised for 3 years.",
              "She has just finished her breakfast.",
              "They went to Paris last summer."
            ]
          }
        ]
      },
      {
        unit: 2,
        title: "The Generation Gap",
        vocabulary: [
          { word: "Conflict", meaning: "Xung đột", example: "Generation gap can lead to conflicts between parents and children." },
          { word: "Open-minded", meaning: "Cởi mở", example: "My parents are very open-minded." },
          { word: "Curfew", meaning: "Giờ giới nghiêm", example: "I have a 10 PM curfew." },
          { word: "Extended family", meaning: "Gia đình đa thế hệ", example: "I live in an extended family with my grandparents." },
          { word: "Nuclear family", meaning: "Gia đình hạt nhân", example: "Most modern families are nuclear families." },
          { word: "Viewpoint", meaning: "Quan điểm", example: "We have different viewpoints on many issues." },
          { word: "Impose", meaning: "Áp đặt", example: "Parents shouldn't impose their choices on their children." },
          { word: "Bridge the gap", meaning: "Rút ngắn khoảng cách", example: "Communication is the best way to bridge the generation gap." },
          { word: "Respect", meaning: "Tôn trọng", example: "We should respect the elderly." }
        ],
        grammar: [
          {
            title: "Modal Verbs: Should, Must, Have to",
            explanation: "Should dùng để đưa ra lời khuyên. Must dùng cho sự bắt buộc từ phía người nói hoặc quy định. Have to dùng cho sự bắt buộc khách quan (do hoàn cảnh hoặc luật lệ).",
            formula: "S + modal verb + V",
            examples: [
              "You should talk to your parents about your problems.",
              "I must finish my homework before I go out.",
              "Students have to wear uniforms at school.",
              "You shouldn't stay up too late."
            ]
          }
        ]
      },
      {
        unit: 3,
        title: "Cities of the Future",
        vocabulary: [
          { word: "Sustainable", meaning: "Bền vững", example: "We need to build sustainable cities." },
          { word: "Smart city", meaning: "Thành phố thông minh", example: "Smart cities use technology to improve life." },
          { word: "Infrastructure", meaning: "Cơ sở hạ tầng", example: "The city's infrastructure needs upgrading." },
          { word: "Urban", meaning: "Thuộc về đô thị", example: "Urban planning is important for future cities." },
          { word: "Livability", meaning: "Khả năng sống tốt", example: "The city aims to improve its livability index." },
          { word: "Renewable energy", meaning: "Năng lượng tái tạo", example: "Future cities will rely more on renewable energy." },
          { word: "Skyscraper", meaning: "Tòa nhà chọc trời", example: "The city skyline is full of skyscrapers." },
          { word: "Overcrowded", meaning: "Quá đông đúc", example: "Many big cities are becoming overcrowded." },
          { word: "Public transport", meaning: "Phương tiện công cộng", example: "An efficient public transport system is essential." }
        ],
        grammar: [
          {
            title: "Stative Verbs in Continuous Forms",
            explanation: "Các động từ chỉ trạng thái (think, smell, taste, see...) thường không dùng ở thì tiếp diễn. Tuy nhiên, khi chúng diễn tả một hành động tạm thời, chúng có thể dùng ở thì tiếp diễn.",
            formula: "S + am/is/are + V-ing",
            examples: [
              "I am thinking about the future. (Action)",
              "I think you are right. (State/Opinion)",
              "She is tasting the soup to see if it needs more salt. (Action)",
              "The soup tastes delicious. (State)"
            ]
          }
        ]
      },
      {
        unit: 4,
        title: "ASEAN and Viet Nam",
        vocabulary: [
          { word: "Association", meaning: "Hiệp hội", example: "ASEAN is an association of Southeast Asian nations." },
          { word: "Solidarity", meaning: "Sự đoàn kết", example: "ASEAN promotes regional solidarity." },
          { word: "Integration", meaning: "Sự hội nhập", example: "Economic integration is a key goal." },
          { word: "Cooperation", meaning: "Sự hợp tác", example: "ASEAN countries work together in close cooperation." },
          { word: "Stability", meaning: "Sự ổn định", example: "The region enjoys peace and stability." },
          { word: "Prosperity", meaning: "Sự thịnh vượng", example: "The goal is to achieve shared prosperity." },
          { word: "Charter", meaning: "Hiến chương", example: "The ASEAN Charter was signed in 2007." },
          { word: "Representative", meaning: "Người đại diện", example: "He is the representative of Viet Nam at the meeting." },
          { word: "Summit", meaning: "Hội nghị thượng đỉnh", example: "The ASEAN Summit is held twice a year." }
        ],
        grammar: [
          {
            title: "Gerunds as Subjects and Objects",
            explanation: "Danh động từ (V-ing) có thể đóng vai trò làm chủ ngữ hoặc tân ngữ trong câu.",
            formula: "V-ing + V (Subject) | S + V + V-ing (Object)",
            examples: [
              "Learning English is fun and useful.",
              "I enjoy working with people from different cultures.",
              "Promoting regional peace is a key goal of ASEAN.",
              "They suggested holding the meeting in Ha Noi."
            ]
          }
        ]
      },
      {
        unit: 5,
        title: "Global Warming",
        vocabulary: [
          { word: "Greenhouse gas", meaning: "Khí nhà kính", example: "Carbon dioxide is a greenhouse gas." },
          { word: "Deforestation", meaning: "Sự phá rừng", example: "Deforestation leads to global warming." },
          { word: "Emission", meaning: "Sự phát thải", example: "We must reduce carbon emissions." },
          { word: "Climate change", meaning: "Biến đổi khí hậu", example: "Climate change is a global threat." },
          { word: "Absorb", meaning: "Hấp thụ", example: "Trees absorb carbon dioxide from the atmosphere." },
          { word: "Consequence", meaning: "Hậu quả", example: "Global warming has serious consequences for the environment." },
          { word: "Catastrophic", meaning: "Thảm khốc", example: "The storm caused catastrophic damage." },
          { word: "Fossil fuel", meaning: "Nhiên liệu hóa thạch", example: "Burning fossil fuels releases greenhouse gases." },
          { word: "Renewable", meaning: "Có thể tái tạo", example: "Solar and wind energy are renewable resources." }
        ],
        grammar: [
          {
            title: "Present Participle Clauses",
            explanation: "Dùng phân từ hiện tại (V-ing) để rút gọn mệnh đề khi hai mệnh đề có cùng chủ ngữ, diễn tả hành động xảy ra đồng thời hoặc liên tiếp.",
            formula: "V-ing, S + V",
            examples: [
              "Knowing the truth, she felt relieved.",
              "Walking in the park, I met an old friend.",
              "Not wanting to wake the baby, she walked quietly.",
              "Feeling tired, he decided to take a nap."
            ]
          }
        ]
      },
      {
        unit: 6,
        title: "Preserving our Heritage",
        vocabulary: [
          { word: "Heritage", meaning: "Di sản", example: "Hoi An is a famous world heritage site." },
          { word: "Restoration", meaning: "Sự trùng tu", example: "The restoration of the ancient temple took years." },
          { word: "Authentic", meaning: "Đích thực", example: "We want to provide an authentic cultural experience." },
          { word: "Preserve", meaning: "Bảo tồn", example: "We must preserve our traditional customs." },
          { word: "Appreciate", meaning: "Trân trọng", example: "Young people should learn to appreciate their heritage." },
          { word: "Landscape", meaning: "Phong cảnh", example: "Ha Long Bay is famous for its beautiful limestone landscape." },
          { word: "Ancient", meaning: "Cổ kính", example: "They are visiting the ancient town of Hoi An." },
          { word: "Culture", meaning: "Văn hóa", example: "Viet Nam has a rich and diverse culture." },
          { word: "Monument", meaning: "Đài tưởng niệm, di tích", example: "The monument was built to honor the heroes." }
        ],
        grammar: [
          {
            title: "To-infinitive Clauses",
            explanation: "Dùng cụm động từ nguyên mẫu có 'to' (to-V) để rút gọn mệnh đề quan hệ sau các từ như 'the first, the second, the last, the only' hoặc so sánh nhất.",
            formula: "Noun + to V",
            examples: [
              "The first person to arrive was Nam.",
              "The best place to visit in Hue is the Citadel.",
              "He was the only student to solve the difficult problem.",
              "This is the most important thing to remember."
            ]
          }
        ]
      },
      {
        unit: 7,
        title: "Education Options for School-Leavers",
        vocabulary: [
          { word: "Vocational", meaning: "Thuộc về nghề nghiệp", example: "Vocational schools provide practical skills." },
          { word: "Qualification", meaning: "Bằng cấp", example: "You need a teaching qualification to work here." },
          { word: "Apprenticeship", meaning: "Sự học việc", example: "He is doing an apprenticeship in mechanics." },
          { word: "Higher education", meaning: "Giáo dục đại học", example: "Many students choose to pursue higher education after high school." },
          { word: "Requirement", meaning: "Yêu cầu", example: "What are the entry requirements for this university?" },
          { word: "Scholarship", meaning: "Học bổng", example: "She won a full scholarship to study abroad." },
          { word: "Institution", meaning: "Học viện, tổ chức", example: "The university is a prestigious educational institution." },
          { word: "Bachelor's degree", meaning: "Bằng cử nhân", example: "He graduated with a bachelor's degree in economics." },
          { word: "Practical", meaning: "Thực tế", example: "Vocational training focuses on practical skills." }
        ],
        grammar: [
          {
            title: "Perfect Gerunds and Perfect Participle Clauses",
            explanation: "Dùng 'Having + V3/ed' để nhấn mạnh một hành động đã hoàn thành trước một hành động khác trong quá khứ.",
            formula: "Having + V3/ed, S + V | S + V + having + V3/ed",
            examples: [
              "Having finished the course, he got a job immediately.",
              "She was proud of having won the first prize.",
              "Having seen the film before, I didn't want to see it again.",
              "He apologized for having broken the vase."
            ]
          }
        ]
      },
      {
        unit: 8,
        title: "Becoming Independent",
        vocabulary: [
          { word: "Self-reliant", meaning: "Tự lực", example: "Students should learn to be self-reliant." },
          { word: "Time management", meaning: "Quản lý thời gian", example: "Time management is a crucial skill." },
          { word: "Responsibility", meaning: "Trách nhiệm", example: "Taking care of yourself is a big responsibility." },
          { word: "Independent", meaning: "Độc lập", example: "She moved out to live an independent life." },
          { word: "Confident", meaning: "Tự tin", example: "He is confident in his ability to solve the problem." },
          { word: "Decision-making", meaning: "Đưa ra quyết định", example: "Decision-making skills are important for everyone." },
          { word: "Strive", meaning: "Phấn đấu", example: "We should strive for excellence in everything we do." },
          { word: "Motivation", meaning: "Động lực", example: "He lacks the motivation to study hard." },
          { word: "Goal", meaning: "Mục tiêu", example: "Setting clear goals is the first step to success." }
        ],
        grammar: [
          {
            title: "It is/was... that... (Cleft Sentences)",
            explanation: "Câu chẻ dùng để nhấn mạnh một thành phần cụ thể trong câu (chủ ngữ, tân ngữ hoặc trạng ngữ).",
            formula: "It is/was + [thành phần nhấn mạnh] + that + S + V",
            examples: [
              "It was my mother who encouraged me to study hard.",
              "It is in the library that we usually study together.",
              "It was the book that she gave me for my birthday.",
              "It is English that I want to master."
            ]
          }
        ]
      },
      {
        unit: 9,
        title: "Social Issues",
        vocabulary: [
          { word: "Poverty", meaning: "Sự nghèo đói", example: "Poverty is still a major issue in some areas." },
          { word: "Bullying", meaning: "Sự bắt nạt", example: "Schools must have policies against bullying." },
          { word: "Awareness", meaning: "Sự nhận thức", example: "We need to raise awareness about mental health." },
          { word: "Discrimination", meaning: "Sự phân biệt đối xử", example: "Discrimination based on race is illegal." },
          { word: "Alcoholism", meaning: "Nghiện rượu", example: "Alcoholism can destroy families." },
          { word: "Overpopulation", meaning: "Bùng nổ dân số", example: "Overpopulation leads to many social problems." },
          { word: "Crime", meaning: "Tội phạm", example: "The government is trying to reduce the crime rate." },
          { word: "Unemployment", meaning: "Sự thất nghiệp", example: "Unemployment is a serious issue for young people." },
          { word: "Domestic violence", meaning: "Bạo lực gia đình", example: "We must speak out against domestic violence." }
        ],
        grammar: [
          {
            title: "Reported Speech with To-infinitives and Gerunds",
            explanation: "Dùng động từ nguyên mẫu có 'to' hoặc danh động từ để thuật lại các câu mệnh lệnh, lời hứa, lời khuyên, lời đề nghị...",
            formula: "S + V (promise/agree/threaten...) + to V | S + V (suggest/admit/deny...) + V-ing",
            examples: [
              "He promised to help me with my homework.",
              "She suggested going to the cinema tonight.",
              "The teacher told us to keep quiet.",
              "He denied stealing the money."
            ]
          }
        ]
      },
      {
        unit: 10,
        title: "Healthy Lifestyle and Longevity",
        vocabulary: [
          { word: "Nutrient", meaning: "Chất dinh dưỡng", example: "Fruits are full of essential nutrients." },
          { word: "Antibiotics", meaning: "Thuốc kháng sinh", example: "Don't take antibiotics without a doctor's advice." },
          { word: "Fitness", meaning: "Sự cân đối", example: "Regular exercise improves your fitness." },
          { word: "Longevity", meaning: "Sự trường thọ", example: "Healthy habits can increase your longevity." },
          { word: "Meditation", meaning: "Thiền định", example: "Meditation helps reduce stress and anxiety." },
          { word: "Stress-free", meaning: "Không căng thẳng", example: "Try to live a stress-free life." },
          { word: "Immune system", meaning: "Hệ miễn dịch", example: "Vitamin C helps boost your immune system." },
          { word: "Life expectancy", meaning: "Tuổi thọ trung bình", example: "Life expectancy is higher in developed countries." },
          { word: "Remedy", meaning: "Phương thuốc", example: "Honey is a good natural remedy for a cough." }
        ],
        grammar: [
          {
            title: "Conditionals in Reported Speech",
            explanation: "Khi tường thuật câu điều kiện, loại 1 thường lùi thì (thành loại 2), còn loại 2 và loại 3 thường giữ nguyên thì.",
            formula: "S + said (that) + if-clause (lùi thì nếu là loại 1)",
            examples: [
              "He said: 'If I have time, I will help you' -> He said if he had time, he would help me.",
              "She said: 'If I were you, I would go' -> She said if she were me, she would go.",
              "They asked: 'What would you do if you won?' -> They asked what I would do if I won.",
              "He said: 'If it had rained, we would have stayed' -> He said if it had rained, they would have stayed."
            ]
          }
        ]
      },
      {
        unit: 11,
        title: "The World of Work",
        vocabulary: [
          { word: "Apprentice", meaning: "Người học việc", example: "He started as an apprentice in a local garage." },
          { word: "Career path", meaning: "Con đường sự nghiệp", example: "She is still deciding on her career path." },
          { word: "Job market", meaning: "Thị trường việc làm", example: "The job market is very competitive nowadays." },
          { word: "Colleague", meaning: "Đồng nghiệp", example: "I have a good relationship with my colleagues." },
          { word: "Promotion", meaning: "Sự thăng chức", example: "He is hoping for a promotion next month." },
          { word: "Requirement", meaning: "Yêu cầu", example: "Experience is a key requirement for this job." },
          { word: "Salary", meaning: "Tiền lương", example: "The salary for this position is quite high." },
          { word: "Working environment", meaning: "Môi trường làm việc", example: "They provide a friendly working environment." },
          { word: "Redundant", meaning: "Dư thừa (bị sa thải)", example: "Many workers were made redundant during the economic crisis." }
        ],
        grammar: [
          {
            title: "Reported Speech with Infinitives",
            explanation: "Dùng để thuật lại các câu yêu cầu, đề nghị, lời khuyên... sử dụng cấu trúc V + O + to V.",
            formula: "S + V (tell/ask/advise/remind...) + O + to V",
            examples: [
              "He told me to wait for him at the station.",
              "She asked me to help her with the heavy bags.",
              "The doctor advised him to stop smoking.",
              "My mother reminded me to lock the door."
            ]
          }
        ]
      },
      {
        unit: 12,
        title: "Cultural Diversity",
        vocabulary: [
          { word: "Diversity", meaning: "Sự đa dạng", example: "Cultural diversity makes our world more interesting." },
          { word: "Tradition", meaning: "Truyền thống", example: "It's a tradition to visit relatives during Tet." },
          { word: "Identity", meaning: "Bản sắc", example: "Language is an important part of cultural identity." },
          { word: "Custom", meaning: "Phong tục", example: "Every country has its own unique customs." },
          { word: "Assimilation", meaning: "Sự đồng hóa", example: "Cultural assimilation can be a difficult process." },
          { word: "Multicultural", meaning: "Đa văn hóa", example: "London is a multicultural city." },
          { word: "Heritage", meaning: "Di sản", example: "We should take pride in our cultural heritage." },
          { word: "Belief", meaning: "Niềm tin", example: "We should respect the religious beliefs of others." },
          { word: "Value", meaning: "Giá trị", example: "Family values are very important in our culture." }
        ],
        grammar: [
          {
            title: "Review of Conditional Sentences",
            explanation: "Ôn tập 3 loại câu điều kiện: Loại 1 (có thật), Loại 2 (không có thật ở hiện tại), Loại 3 (không có thật ở quá khứ).",
            formula: "Type 1: If + S + V(s/es), S + will + V | Type 2: If + S + V2/ed, S + would + V | Type 3: If + S + had + V3/ed, S + would have + V3/ed",
            examples: [
              "If I were you, I would take that job offer.",
              "If it had rained yesterday, we would have stayed at home.",
              "If you study hard, you will pass the exam.",
              "If I had known the truth, I wouldn't have been so angry."
            ]
          }
        ]
      }
    ]
  },
  {
    grade: 12,
    units: [
      {
        unit: 1,
        title: "Life Stories",
        vocabulary: [
          { word: "Biography", meaning: "Tiểu sử", example: "I am reading a biography of Steve Jobs." },
          { word: "Perseverance", meaning: "Sự kiên trì", example: "Success requires a lot of perseverance." },
          { word: "Inspiration", meaning: "Nguồn cảm hứng", example: "His life story is a great inspiration to me." },
          { word: "Distinguished", meaning: "Lỗi lạc, xuất sắc", example: "He had a distinguished career as a scientist." },
          { word: "Generosity", meaning: "Sự hào phóng", example: "The charity depends on the generosity of the public." },
          { word: "Achievement", meaning: "Thành tựu", example: "Winning the Nobel Prize was his greatest achievement." },
          { word: "Dedication", meaning: "Sự tận tụy", example: "She was rewarded for her dedication to the company." },
          { word: "Influential", meaning: "Có sức ảnh hưởng", example: "He is one of the most influential people in the world." },
          { word: "Legacy", meaning: "Di sản (để lại)", example: "The artist left a rich legacy of beautiful paintings." }
        ],
        grammar: [
          {
            title: "Past Simple vs. Past Continuous",
            explanation: "Quá khứ đơn dùng cho hành động đã kết thúc hoặc hành động xen vào. Quá khứ tiếp diễn dùng cho hành động đang diễn ra tại một thời điểm trong quá khứ.",
            formula: "Past Simple: S + V2/ed | Past Continuous: S + was/were + V-ing",
            examples: [
              "I was reading a book when the phone rang.",
              "He was working in the garden all morning yesterday.",
              "While they were traveling in Europe, they met many interesting people.",
              "She finished her homework and then went to bed."
            ]
          }
        ]
      },
      {
        unit: 2,
        title: "Urbanisation",
        vocabulary: [
          { word: "Urbanisation", meaning: "Đô thị hóa", example: "Urbanisation is happening rapidly in many developing countries." },
          { word: "Overload", meaning: "Quá tải", example: "The city's transport system is often overloaded during rush hour." },
          { word: "Slum", meaning: "Khu ổ chuột", example: "Many people live in slums with poor living conditions." },
          { word: "Industrialisation", meaning: "Công nghiệp hóa", example: "Industrialisation has led to the growth of many cities." },
          { word: "Migration", meaning: "Sự di cư", example: "Rural-to-urban migration is a common trend." },
          { word: "Infrastructure", meaning: "Cơ sở hạ tầng", example: "The government is investing in new infrastructure projects." },
          { word: "Inhabitant", meaning: "Cư dân", example: "The city has over five million inhabitants." },
          { word: "Prospect", meaning: "Triển vọng", example: "Young people move to cities in search of better job prospects." },
          { word: "Standard of living", meaning: "Mức sống", example: "The standard of living in cities is generally higher than in rural areas." }
        ],
        grammar: [
          {
            title: "Compound Adjectives",
            explanation: "Tính từ ghép thường được tạo thành từ hai hoặc nhiều từ nối với nhau bằng dấu gạch ngang, dùng để bổ nghĩa cho danh từ.",
            formula: "Adj/Adv/Noun + V-ing/V-ed/Noun/Adj",
            examples: [
              "He lives in a densely-populated area.",
              "This is a long-term project that requires a lot of effort.",
              "She is a well-known actress in our country.",
              "They are looking for a cost-effective solution to the problem."
            ]
          }
        ]
      },
      {
        unit: 3,
        title: "The Green Movement",
        vocabulary: [
          { word: "Renewable", meaning: "Có thể tái tạo", example: "Solar and wind energy are renewable sources of power." },
          { word: "Biodegradable", meaning: "Có thể phân hủy sinh học", example: "We should use biodegradable packaging to protect the environment." },
          { word: "Conservation", meaning: "Sự bảo tồn", example: "Wildlife conservation is essential for maintaining biodiversity." },
          { word: "Eco-friendly", meaning: "Thân thiện với môi trường", example: "More people are choosing eco-friendly products nowadays." },
          { word: "Sustainability", meaning: "Sự bền vững", example: "The company is committed to environmental sustainability." },
          { word: "Depletion", meaning: "Sự cạn kiệt", example: "The depletion of natural resources is a serious concern." },
          { word: "Hazardous", meaning: "Nguy hiểm", example: "Hazardous waste must be disposed of carefully." },
          { word: "Organic", meaning: "Hữu cơ", example: "Organic farming does not use synthetic pesticides." },
          { word: "Preserve", meaning: "Gìn giữ, bảo tồn", example: "We must preserve our forests for future generations." }
        ],
        grammar: [
          {
            title: "Articles: A, An, The",
            explanation: "A/An dùng cho danh từ đếm được số ít chưa xác định. The dùng cho danh từ đã được nhắc đến hoặc xác định cụ thể.",
            formula: "a/an + consonant/vowel sound | the + specific noun",
            examples: [
              "A tree was planted in the garden yesterday.",
              "The sun rises in the east.",
              "He is an honest man.",
              "The environment is being polluted by human activities."
            ]
          }
        ]
      },
      {
        unit: 4,
        title: "The Mass Media",
        vocabulary: [
          { word: "Broadcast", meaning: "Phát sóng", example: "The news is broadcast live every evening." },
          { word: "Interactive", meaning: "Tương tác", example: "Social media platforms are highly interactive." },
          { word: "Cyberbullying", meaning: "Bắt nạt qua mạng", example: "Cyberbullying can have a serious impact on mental health." },
          { word: "Addicted", meaning: "Nghiện", example: "Many teenagers are addicted to social media." },
          { word: "Reliable", meaning: "Đáng tin cậy", example: "It's important to find reliable sources of information." },
          { word: "Mass media", meaning: "Phương tiện truyền thông đại chúng", example: "The mass media plays a crucial role in shaping public opinion." },
          { word: "Instant", meaning: "Tức thì", example: "The internet provides instant access to news from around the world." },
          { word: "Connect", meaning: "Kết nối", example: "Social media helps us connect with friends and family." },
          { word: "Influence", meaning: "Ảnh hưởng", example: "The media has a great influence on our daily lives." }
        ],
        grammar: [
          {
            title: "Prepositions after Verbs",
            explanation: "Nhiều động từ trong tiếng Anh đi kèm với các giới từ cố định để tạo thành nghĩa cụ thể.",
            formula: "Verb + Preposition (to, for, in, on, at...)",
            examples: [
              "You should listen to the advice of your parents.",
              "She apologized for being late to the meeting.",
              "They are interested in learning about new technologies.",
              "He depends on his parents for financial support."
            ]
          }
        ]
      },
      {
        unit: 5,
        title: "Cultural Identity",
        vocabulary: [
          { word: "Heritage", meaning: "Di sản", example: "We must take pride in our cultural heritage." },
          { word: "Assimilation", meaning: "Sự đồng hóa", example: "Cultural assimilation can be a slow and complex process." },
          { word: "Custom", meaning: "Phong tục", example: "It is a custom to give red envelopes during the Lunar New Year." },
          { word: "Identity", meaning: "Bản sắc", example: "Language is a key part of a person's cultural identity." },
          { word: "Diversity", meaning: "Sự đa dạng", example: "Cultural diversity makes our society more vibrant." },
          { word: "Maintain", meaning: "Duy trì", example: "It's important to maintain our traditional values." },
          { word: "Preserve", meaning: "Bảo tồn", example: "Efforts are being made to preserve endangered languages." },
          { word: "Unique", meaning: "Độc đáo", example: "Every culture has its own unique traditions and customs." },
          { word: "Values", meaning: "Các giá trị", example: "Family values are highly respected in many cultures." }
        ],
        grammar: [
          {
            title: "Double Comparatives",
            explanation: "Cấu trúc 'The + comparative..., the + comparative...' dùng để diễn tả mối quan hệ nhân quả: cái này càng... thì cái kia càng...",
            formula: "The + comparative + S + V, the + comparative + S + V",
            examples: [
              "The harder you study, the better your results will be.",
              "The more I know him, the more I like him.",
              "The older he gets, the wiser he becomes.",
              "The more expensive the hotel is, the better the service should be."
            ]
          }
        ]
      },
      {
        unit: 6,
        title: "Endangered Species",
        vocabulary: [
          { word: "Extinction", meaning: "Sự tuyệt chủng", example: "Many species are on the verge of extinction due to habitat loss." },
          { word: "Biodiversity", meaning: "Đa dạng sinh học", example: "Biodiversity is essential for a healthy and stable ecosystem." },
          { word: "Habitat", meaning: "Môi trường sống", example: "The destruction of natural habitats is a major threat to wildlife." },
          { word: "Endangered", meaning: "Đang gặp nguy hiểm", example: "The giant panda is one of the most famous endangered species." },
          { word: "Conservation", meaning: "Sự bảo tồn", example: "Conservation efforts are needed to protect endangered animals." },
          { word: "Poaching", meaning: "Săn bắn trộm", example: "Poaching is a serious crime that threatens many species." },
          { word: "Sanctuary", meaning: "Khu bảo tồn", example: "The animals are kept in a wildlife sanctuary for their protection." },
          { word: "Survival", meaning: "Sự sống sót", example: "The survival of these species depends on our actions." },
          { word: "Threaten", meaning: "Đe dọa", example: "Pollution and climate change threaten many ecosystems." }
        ],
        grammar: [
          {
            title: "Future Perfect",
            explanation: "Thì tương lai hoàn thành dùng để diễn tả một hành động sẽ hoàn thành trước một thời điểm hoặc một hành động khác trong tương lai.",
            formula: "S + will have + V3/ed",
            examples: [
              "By 2050, many species will have become extinct if we don't act now.",
              "I will have finished the report by the time you arrive.",
              "By the end of this year, they will have lived here for ten years.",
              "She will have graduated from university by next summer."
            ]
          }
        ]
      },
      {
        unit: 7,
        title: "Artificial Intelligence",
        vocabulary: [
          { word: "Artificial Intelligence", meaning: "Trí tuệ nhân tạo", example: "AI is transforming many aspects of our daily lives." },
          { word: "Automation", meaning: "Sự tự động hóa", example: "Automation can increase efficiency and productivity in factories." },
          { word: "Algorithm", meaning: "Thuật toán", example: "The search engine uses a complex algorithm to provide results." },
          { word: "Robotics", meaning: "Rô-bốt học", example: "Robotics is a field that combines engineering and computer science." },
          { word: "Machine learning", meaning: "Máy học", example: "Machine learning allows computers to learn from data." },
          { word: "Virtual assistant", meaning: "Trợ lý ảo", example: "Many people use virtual assistants like Siri or Alexa." },
          { word: "Revolutionize", meaning: "Cách mạng hóa", example: "AI has the potential to revolutionize healthcare." },
          { word: "Sophisticated", meaning: "Tinh vi, phức tạp", example: "Modern AI systems are becoming increasingly sophisticated." },
          { word: "Impact", meaning: "Tác động", example: "The impact of AI on the job market is a topic of much debate." }
        ],
        grammar: [
          {
            title: "Active and Passive Causative",
            explanation: "Cấu trúc nhờ vả dùng để diễn tả việc mình nhờ hoặc thuê người khác làm gì đó cho mình.",
            formula: "Active: Have someone do / Get someone to do | Passive: Have/Get something done",
            examples: [
              "I'll have the technician fix my computer tomorrow.",
              "I had my hair cut yesterday at the new salon.",
              "She got her brother to help her with the homework.",
              "We are going to have our house repainted next week."
            ]
          }
        ]
      },
      {
        unit: 8,
        title: "The World of Work",
        vocabulary: [
          { word: "Colleague", meaning: "Đồng nghiệp", example: "I get along very well with my colleagues at work." },
          { word: "Promotion", meaning: "Sự thăng chức", example: "She was delighted to receive a promotion after her hard work." },
          { word: "Redundant", meaning: "Dư thừa (bị sa thải)", example: "Many workers were made redundant during the economic downturn." },
          { word: "Career path", meaning: "Con đường sự nghiệp", example: "It's important to choose a career path that suits your interests." },
          { word: "Job satisfaction", meaning: "Sự hài lòng trong công việc", example: "Job satisfaction is often more important than a high salary." },
          { word: "Qualification", meaning: "Bằng cấp, trình độ", example: "He has all the necessary qualifications for the position." },
          { word: "Recruit", meaning: "Tuyển dụng", example: "The company is looking to recruit new talented employees." },
          { word: "Resign", meaning: "Từ chức", example: "He decided to resign from his job to start his own business." },
          { word: "Workplace", meaning: "Nơi làm việc", example: "A positive workplace environment can boost productivity." }
        ],
        grammar: [
          {
            title: "Double Comparatives (Review)",
            explanation: "Ôn tập cấu trúc 'The more..., the more...' để nhấn mạnh sự thay đổi tương ứng giữa hai vế.",
            formula: "The + comparative + S + V, the + comparative + S + V",
            examples: [
              "The more you practice, the more confident you will become.",
              "The harder you work, the more successful you will be.",
              "The more experience you have, the better your job prospects are.",
              "The earlier you start, the sooner you will finish."
            ]
          }
        ]
      },
      {
        unit: 9,
        title: "Choosing a Career",
        vocabulary: [
          { word: "Entrepreneur", meaning: "Doanh nhân", example: "He is a successful entrepreneur who started his own tech company." },
          { word: "Vocational", meaning: "Thuộc về nghề nghiệp", example: "Vocational training provides students with practical skills." },
          { word: "Apprenticeship", meaning: "Sự học việc", example: "He is doing an apprenticeship to become a skilled carpenter." },
          { word: "Profession", meaning: "Nghề nghiệp (đòi hỏi chuyên môn cao)", example: "Teaching is a very noble profession." },
          { word: "Sector", meaning: "Lĩnh vực, ngành", example: "The service sector is a major part of our economy." },
          { word: "Suitability", meaning: "Sự phù hợp", example: "The test is designed to assess your suitability for the job." },
          { word: "Requirement", meaning: "Yêu cầu", example: "What are the entry requirements for this course?" },
          { word: "Guidance", meaning: "Sự hướng dẫn", example: "Students often seek career guidance from their teachers." },
          { word: "Passion", meaning: "Niềm đam mê", example: "You should follow your passion when choosing a career." }
        ],
        grammar: [
          {
            title: "Phrasal Verbs",
            explanation: "Cụm động từ gồm một động từ kết hợp với một hoặc hai tiểu từ (giới từ hoặc trạng từ), tạo thành nghĩa mới.",
            formula: "Verb + Particle(s)",
            examples: [
              "I need to look for a new job that suits my skills.",
              "She decided to take up photography as a hobby.",
              "Don't give up on your dreams, no matter how hard it gets.",
              "We should carry out more research before making a decision."
            ]
          }
        ]
      },
      {
        unit: 10,
        title: "Lifelong Learning",
        vocabulary: [
          { word: "Self-study", meaning: "Tự học", example: "Self-study is an essential part of lifelong learning." },
          { word: "Distance learning", meaning: "Học từ xa", example: "Distance learning allows people to study at their own pace." },
          { word: "Knowledgeable", meaning: "Có kiến thức, am hiểu", example: "She is very knowledgeable about environmental issues." },
          { word: "Acquire", meaning: "Tiếp thu, đạt được", example: "It's important to acquire new skills throughout your life." },
          { word: "Continuous", meaning: "Liên tục", example: "Lifelong learning is a continuous process of personal growth." },
          { word: "Flexible", meaning: "Linh hoạt", example: "Online courses offer a flexible way to learn new things." },
          { word: "Motivation", meaning: "Động lực", example: "Self-motivation is key to successful lifelong learning." },
          { word: "Opportunity", meaning: "Cơ hội", example: "There are many opportunities for adults to continue their education." },
          { word: "Pursue", meaning: "Theo đuổi", example: "He decided to pursue a master's degree in business." }
        ],
        grammar: [
          {
            title: "Conditionals with Inversion",
            explanation: "Đảo ngữ trong câu điều kiện dùng để làm cho câu văn mang tính trang trọng hơn.",
            formula: "Should S + V (Type 1) | Were S + to V (Type 2) | Had S + V3/ed (Type 3)",
            examples: [
              "Should you need any further information, please let me know.",
              "Were I to win the lottery, I would travel around the world.",
              "Had I known about the meeting, I would have attended it.",
              "Should it rain, the event will be held indoors."
            ]
          }
        ]
      },
      {
        unit: 11,
        title: "Travelling in the Future",
        vocabulary: [
          { word: "Hyperloop", meaning: "Hệ thống tàu siêu tốc", example: "Hyperloop could revolutionize long-distance travel in the future." },
          { word: "Space tourism", meaning: "Du lịch không gian", example: "Space tourism may become a reality for many people in the future." },
          { word: "Sustainable travel", meaning: "Du lịch bền vững", example: "Sustainable travel aims to minimize the impact on the environment." },
          { word: "Teleportation", meaning: "Sự dịch chuyển tức thời", example: "Teleportation is still a concept of science fiction." },
          { word: "Eco-friendly", meaning: "Thân thiện với môi trường", example: "Future transport will focus on eco-friendly technologies." },
          { word: "Innovation", meaning: "Sự đổi mới", example: "Innovation in transport will make travel faster and safer." },
          { word: "Accessible", meaning: "Có thể tiếp cận", example: "Travel should be made more accessible to everyone." },
          { word: "Destination", meaning: "Điểm đến", example: "Mars could be a future travel destination for humans." },
          { word: "Experience", meaning: "Trải nghiệm", example: "Future travel will offer unique and exciting experiences." }
        ],
        grammar: [
          {
            title: "Future Perfect Continuous",
            explanation: "Thì tương lai hoàn thành tiếp diễn diễn tả một hành động kéo dài liên tục cho đến một thời điểm trong tương lai.",
            formula: "S + will have been + V-ing",
            examples: [
              "By next month, I will have been living in this city for ten years.",
              "How long will you have been studying English by the end of this year?",
              "By the time he retires, he will have been working here for 40 years.",
              "They will have been traveling for two weeks by next Sunday."
            ]
          }
        ]
      },
      {
        unit: 12,
        title: "Globalisation",
        vocabulary: [
          { word: "Globalisation", meaning: "Sự toàn cầu hóa", example: "Globalisation has led to increased trade and cultural exchange." },
          { word: "Integration", meaning: "Sự hội nhập", example: "Economic integration is a key aspect of globalisation." },
          { word: "Cultural exchange", meaning: "Trao đổi văn hóa", example: "Globalisation promotes cultural exchange between nations." },
          { word: "Interconnected", meaning: "Kết nối lẫn nhau", example: "The world is becoming increasingly interconnected." },
          { word: "Trade", meaning: "Thương mại", example: "International trade is essential for economic growth." },
          { word: "Impact", meaning: "Tác động", example: "Globalisation has both positive and negative impacts on society." },
          { word: "Challenge", meaning: "Thử thách", example: "Globalisation presents many challenges for developing countries." },
          { word: "Opportunity", meaning: "Cơ hội", example: "Globalisation creates new opportunities for businesses and individuals." },
          { word: "Standardization", meaning: "Sự tiêu chuẩn hóa", example: "Globalisation can lead to the standardization of products and services." }
        ],
        grammar: [
          {
            title: "Review of Relative Clauses",
            explanation: "Ôn tập các loại mệnh đề quan hệ xác định và không xác định, cùng với cách dùng đại từ quan hệ.",
            formula: "Noun + who/which/that/whose/whom...",
            examples: [
              "The book that I bought yesterday is very interesting.",
              "My brother, who lives in New York, is a doctor.",
              "The city where I was born is very beautiful.",
              "The man whose car was stolen is my neighbor."
            ]
          }
        ]
      }
    ]
  }
];
