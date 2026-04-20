class PokemonBattle {
    constructor() {
        this.enemy = {
            name: "마그케인",
            maxHp: 92,
            currentHp: 67,
            level: 34
        };
        
        this.player = {
            name: "나드킹",
            maxHp: 100,
            currentHp: 100,
            level: 33
        };
        
        this.damagePerHit = 10;
        this.hitCount = 0;
        this.maxHits = 10;
        this.isAttacking = false;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.updateHealthDisplay();
        this.showMessage("나드킹이 마그케인에게 폭탄을 던질 준비가 되었다!");
    }
    
    initializeElements() {
        this.fightBtn = document.getElementById('fight-btn');
        this.enemyHealth = document.getElementById('enemy-health');
        this.enemyHpCurrent = document.getElementById('enemy-hp-current');
        this.enemyHpMax = document.getElementById('enemy-hp-max');
        this.enemyImage = document.getElementById('enemy-image');
        this.explosion = document.getElementById('explosion');
        this.bombAnimation = document.getElementById('bomb-animation');
        this.messageBox = document.getElementById('message-box');
        this.messageText = document.getElementById('message-text');
    }
    
    initializeEventListeners() {
        this.fightBtn.addEventListener('click', () => {
            if (!this.isAttacking) {
                this.attack();
            }
        });
    }
    
    async attack() {
        if (this.isAttacking || this.enemy.currentHp <= 0) return;
        
        this.isAttacking = true;
        this.hitCount++;
        
        // 공격 메시지
        this.showMessage(`나드킹이 폭탄을 던졌다! (${this.hitCount}/${this.maxHits})`);
        
        // 폭탄 던지기 애니메이션
        await this.throwBomb();
        
        // 데미지 계산
        const damage = this.calculateDamage();
        this.enemy.currentHp = Math.max(0, this.enemy.currentHp - damage);
        
        // 폭발 효과
        await this.showExplosion();
        
        // 포켓몬 피격 애니메이션
        this.showHitAnimation();
        
        // 체력 업데이트
        this.updateHealthDisplay();
        
        // 결과 확인
        await this.sleep(1000);
        if (this.enemy.currentHp <= 0) {
            this.showVictory();
        } else if (this.hitCount >= this.maxHits) {
            this.showMessage("나드킹의 공격이 끝났다! 마그케인이 아직 살아있다!");
        } else {
            this.showMessage(`마그케인에게 ${damage}의 데미지! 남은 공격: ${this.maxHits - this.hitCount}번`);
        }
        
        this.isAttacking = false;
    }
    
    async throwBomb() {
        this.bombAnimation.style.display = 'block';
        this.bombAnimation.className = 'bomb-animation bomb-throw';
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.bombAnimation.style.display = 'none';
                this.bombAnimation.className = 'bomb-animation';
                resolve();
            }, 1000);
        });
    }
    
    async showExplosion() {
        // 핵폭탄 이미지로 교체
        const originalSrc = this.enemyImage.src;
        this.enemyImage.src = '핵폭탄.png';
        
        // 폭발 이펙트
        this.explosion.className = 'explosion active';
        
        // 화면 흔들기
        document.body.style.animation = 'shake 0.5s ease-in-out';
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.explosion.className = 'explosion';
                this.enemyImage.src = originalSrc;
                document.body.style.animation = '';
                resolve();
            }, 500);
        });
    }
    
    showHitAnimation() {
        this.enemyImage.parentElement.className = 'pokemon-sprite enemy-sprite pokemon-hit';
        
        setTimeout(() => {
            this.enemyImage.parentElement.className = 'pokemon-sprite enemy-sprite';
        }, 500);
    }
    
    calculateDamage() {
        // 기본 데미지에 약간의 랜덤성 추가
        const baseDamage = this.damagePerHit;
        const randomFactor = Math.random() * 0.4 + 0.8; // 0.8 ~ 1.2
        return Math.floor(baseDamage * randomFactor);
    }
    
    updateHealthDisplay() {
        const healthPercentage = (this.enemy.currentHp / this.enemy.maxHp) * 100;
        this.enemyHealth.style.width = `${healthPercentage}%`;
        
        // 체력에 따른 색상 변경
        if (healthPercentage <= 20) {
            this.enemyHealth.className = 'health-fill critical';
        } else if (healthPercentage <= 40) {
            this.enemyHealth.className = 'health-fill low';
        } else {
            this.enemyHealth.className = 'health-fill';
        }
        
        this.enemyHpCurrent.textContent = this.enemy.currentHp;
        this.enemyHpMax.textContent = this.enemy.maxHp;
    }
    
    showVictory() {
        this.showMessage("🎉 마그케인이 쓰러졌다! 나드킹이 승리했다! 🎉");
        this.fightBtn.textContent = "게임 종료";
        this.fightBtn.className = "menu-item disabled";
        
        // 승리 애니메이션
        this.enemyImage.style.opacity = '0.3';
        this.enemyImage.style.transform = 'rotate(90deg)';
        
        // 폭죽 효과
        this.showFireworks();
    }
    
    showFireworks() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.textContent = '🎆';
                firework.style.position = 'absolute';
                firework.style.fontSize = '30px';
                firework.style.left = Math.random() * window.innerWidth + 'px';
                firework.style.top = Math.random() * window.innerHeight + 'px';
                firework.style.animation = 'explode 2s ease-out forwards';
                document.body.appendChild(firework);
                
                setTimeout(() => {
                    document.body.removeChild(firework);
                }, 2000);
            }, i * 300);
        }
    }
    
    showMessage(text) {
        this.messageText.textContent = text;
        
        // 타이핑 효과
        this.messageText.style.animation = 'none';
        setTimeout(() => {
            this.messageText.style.animation = 'typing 0.5s steps(40, end)';
        }, 10);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    resetGame() {
        this.enemy.currentHp = this.enemy.maxHp;
        this.hitCount = 0;
        this.isAttacking = false;
        this.updateHealthDisplay();
        this.fightBtn.textContent = "▶ 싸우다";
        this.fightBtn.className = "menu-item";
        this.enemyImage.style.opacity = '1';
        this.enemyImage.style.transform = 'none';
        this.showMessage("새로운 배틀이 시작되었다!");
    }
}

// 타이핑 애니메이션 CSS 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes typing {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .firework {
        animation: firework 2s ease-out forwards;
    }
    
    @keyframes firework {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    const game = new PokemonBattle();
    
    // 리셋 버튼 (숨겨진 기능 - R키)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'r') {
            game.resetGame();
        }
    });
    
    console.log("🎮 포켓몬 폭탄 배틀 게임이 시작되었습니다!");
    console.log("💡 팁: R키를 눌러서 게임을 리셋할 수 있습니다.");
});