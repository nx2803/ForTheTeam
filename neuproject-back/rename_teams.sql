-- API 공식 명칭과 일치하도록 DB 팀 이름을 업데이트합니다.
-- 이 작업을 선행하면 향후 모든 동기화가 정확하게 이루어집니다.

-- La Liga
UPDATE teams
SET
    name = 'Club Atlético de Madrid'
WHERE
    name = 'Atletico Madrid';

UPDATE teams
SET
    name = 'Deportivo Alavés'
WHERE
    name = 'Deportivo Alaves';

-- Serie A
UPDATE teams
SET
    name = 'FC Internazionale Milano'
WHERE
    name = 'Inter Milan';

UPDATE teams SET name = 'AC Pisa 1909' WHERE name = 'Pisa SC';

-- LCK
UPDATE teams
SET
    name = 'Nongshim Red Force'
WHERE
    name = 'Nongshim RedForce';

-- (참고) NBA 팀들은 현재 DB에 정보가 없어 매칭되지 않는 것이 정상입니다.