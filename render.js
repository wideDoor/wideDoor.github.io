const fs = require('fs');
const handlebars = require('handlebars');

try {
    const data = JSON.parse(fs.readFileSync('resume.json', 'utf8'));
    
    // 수치 강조 정규식 (ms, %, 배, TPS, QPS 등 시니어 성과 지표 자동 추출)
    const highlight = (text) => {
        if (!text) return text;
        return text.replace(/(\d+(\.\d+)?(ms|us|s|%|배|K|TPS|QPS|ops\/s|건|시간|분))/g, '<span class="metric">$1</span>');
    };

    data.experiences.forEach(exp => {
        exp.achievement_groups.forEach(ach => {
            ach.items.forEach(item => {
                item.text = highlight(item.text);
                if (item.sub_items) {
                    item.sub_items = item.sub_items.map(sub => highlight(sub));
                }
            });
        });
    });

    const template = handlebars.compile(fs.readFileSync('resume.hbs', 'utf8'));
    fs.writeFileSync('index.html', template(data), 'utf8');
    console.log('✅ 20년 전체 성과 및 중첩 리스트가 반영되었습니다!');
} catch (e) { console.error(e.message); }