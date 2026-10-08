window.PORTFOLIO_CONTENT={
  panels:{
    projects:{number:'01',label:'精选项目',title:'把想法做成可用的产品。',showcase:[
      {name:'Nucleus Cards',category:'产品 · 人工智能 · 研究',description:'另类资产研究产品：把信息发现、证据追溯与判断复盘组织成一套清晰流程。',steps:['发现信息','比较样本','追溯证据','复盘判断'],link:'https://nucleus-cards.vercel.app/',linkLabel:'打开在线演示'},
      {name:'CourtMatch Analytics',category:'数据 · 分析 · NBA',description:'NBA 数据分析项目：围绕数据清洗、映射与校验，搭建可重复使用的研究流程。',steps:['数据清洗','ID 映射','质量校验','比赛分析'],link:'https://gfthcode.github.io/courtmatch-analytics/',linkLabel:'打开在线演示'}
    ],sections:[
      {eyebrow:'01 / 产品 · 数据 · 人工智能',title:'Nucleus Cards',text:'围绕另类资产信息分散、挂牌与成交口径容易混淆、样本稀少的问题，设计一套可追溯的研究流程。项目从需求定义到前后端集成与线上 MVP，由我独立推进。',bullets:['让发现、比较与复盘形成连续的产品流程。','将证据来源和数据口径保留在研究结果中。','样本不足时降低结论强度；AI 输出附带证据、置信度与失效条件。'],tags:['Next.js','React','TypeScript','Supabase','AI SDK','Vercel'],links:[['在线演示','https://nucleus-cards.vercel.app/'],['GitHub 仓库','https://github.com/gfthcode/nucleus-cards']]},
      {eyebrow:'02 / 数据 · 分析 · NBA',title:'CourtMatch Analytics',text:'把多源篮球数据整理成可重复使用的研究流程，从清洗、ID 映射到比赛分析看板，明确口径并降低数据质量问题。',bullets:['制定 CSV、Excel、Parquet 数据清洗标准。','加入 Schema 与外键校验、更新时间和方法说明。','将分析流程部署到 GitHub Pages。'],tags:['Python','Pandas','JSON','GitHub Pages'],links:[['在线演示','https://gfthcode.github.io/courtmatch-analytics/'],['GitHub 仓库','https://github.com/gfthcode/courtmatch-analytics']]}
    ]},
    experience:{number:'02',label:'实习经历',title:'Rokid AIUI · AI 产品实习生',sections:[{eyebrow:'杭州 · 2025.12 — 2026.02',title:'参与智能眼镜 Agent、无障碍体验与海外适配。',text:'在 Rokid AI 眼镜实习期间，围绕 AIUI 智能体的端云协同与交互架构、无障碍模式产品设计，以及海外多语言体验开展产品工作。',subsections:[['01 / AIUI 智能体端云协同与交互架构','梳理“用户请求 → AgentY 意图路由 → AIUI 加载 → 眼镜端卡片或场景渲染 → 动作回传”的端到端链路，拆解流式 ASR、端侧 VAD / RFM-Lite、云端 LLM / TTS、权限校验和版本兼容等分支，明确端云协作边界与关键依赖。按本地、云端、端云协同归类 70+ 条意图，补充槽位、二次确认、冲突处理与兜底逻辑；同时梳理 Android、iOS、鸿蒙的 WebSocket 改造范围，以及 AIUI / A2UI 组件和事件边界，为跨端方案评审提供统一口径。参与整理端侧模型准入指标：响应时延 50ms 内、准确率 92% 以上、存储占用不超过 200MB；综合权衡时延、准确率、资源占用与离线可用性，形成模型选型和准入评估框架。'],['02 / Rokid Glasses 无障碍模式产品设计与体验升级','基于近 200 位视障、听障用户反馈与残联座谈，归纳真实使用障碍，拆解视觉辅助、无障碍阅读、字幕和 App 读屏 4 条需求路径；输出 PRD 与测试指标，将用户诉求转化为可评审、可验收的产品方案。参与系统级无障碍模式、流式 OCR + TTS，以及 TalkBack / VoiceOver 适配，并围绕识别质量、首包速度和读屏标签覆盖推动体验优化：首包延迟由 9 秒以上降至 1 秒以内，OCR 错误率由约 25% 降至 10% 以内，核心读屏标签覆盖率由不足 30% 提升至 100%。'],['03 / Hi Rokid 海外多语言与翻译体验适配','配合海外版本与 CES 展示，拆解界面、ASR、意图、TTS 与 OTA 文案的语言适配边界，并对标讯飞、Microsoft、RayNeo、Even Reality、Meta 等方案。整理 9+ 新增语言的覆盖范围、在线 / 离线能力差异、上线限制与风险提示，为海外版本范围和演示内容提供依据。']],tags:['AIUI Agent','AgentY 意图路由','端云协同','70+ 条意图','OCR / TTS','TalkBack / VoiceOver','9+ 新增语言']}]},
    github:{number:'03',label:'开源项目 / GitHub',title:'在公开仓库里持续迭代。',sections:[{eyebrow:'GITHUB.COM / GFTHCODE',title:'可查看的项目与代码',text:'下面列出简历与现有网站中的真实仓库入口。',repos:[['nucleus-cards','另类资产研究产品 · Next.js / Supabase / AI SDK','https://github.com/gfthcode/nucleus-cards'],['courtmatch-analytics','NBA 数据分析项目 · Python / Pandas','https://github.com/gfthcode/courtmatch-analytics']],links:[['打开 GitHub 个人主页','https://github.com/gfthcode']]}]},
    about:{number:'04',label:'关于我',title:'陈高波',sections:[{eyebrow:'新南威尔士大学 · 金融科技',title:'在金融、技术和产品之间找问题。',text:'新南威尔士大学金融科技本科生（2025—2027）。关注 AI 产品、数据与真实用户体验，喜欢从用户反馈出发，把复杂需求拆解成可交付的方案。',subsections:[['教育背景','新南威尔士大学 UNSW｜金融科技本科｜2025—2027'],['技能','产品需求分析、用户研究、AI 产品设计、数据分析、Python、Pandas、Next.js、React、TypeScript、Supabase'],['兴趣','NBA、攀岩、卡丁车'],['联系方式','电话：15268817047｜邮箱：g1628908@gmail.com']],links:[['拨打电话','tel:+8615268817047'],['发送邮件','mailto:g1628908@gmail.com'],['在线查看简历 PDF','assets/Chen_Gaobo_Resume.pdf']] }]}
  }
};

// Scene copy and destinations are edited here; detailed resume material remains above.
window.PORTFOLIO_SCENES = [
 {mark:'序章 / 个人作品集',caption:'从观察，到行动。',hint:'向下滚动',theme:'#e6e5e2'},
 {mark:'01 / 个人项目',caption:'选择一个项目，打开它的故事。',hint:'继续探索实习',theme:'#e6e5e2'},
 {mark:'02 / Rokid 实习',caption:'Rokid · AIUI · AI 产品实习生',hint:'回到序章',theme:'#090909'}
];
