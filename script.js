// Data Storage
const storage = {
    getProfile() {
        return JSON.parse(localStorage.getItem('fitteen_profile')) || {
            name: '',
            age: '',
            gender: 'male',
            height: '',
            weight: '',
            goal: 'general'
        };
    },
    saveProfile(data) {
        localStorage.setItem('fitteen_profile', JSON.stringify(data));
    },
    getLogEntries() {
        return JSON.parse(localStorage.getItem('fitteen_logs')) || [];
    },
    addLogEntry(entry) {
        const logs = this.getLogEntries();
        logs.push(entry);
        localStorage.setItem('fitteen_logs', JSON.stringify(logs));
    },
    getWorkoutDays() {
        return JSON.parse(localStorage.getItem('fitteen_workouts')) || [];
    },
    addWorkoutDay() {
        const days = this.getWorkoutDays();
        const today = new Date().toISOString().split('T')[0];
        if (!days.includes(today)) {
            days.push(today);
            localStorage.setItem('fitteen_workouts', JSON.stringify(days));
        }
    }
};

// Page Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageName).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');

    // Load page data
    if (pageName === 'log') loadLogEntries();
    if (pageName === 'stats') loadStats();
    if (pageName === 'profile') loadProfile();
}

// BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);

    if (!weight || !height || weight <= 0 || height <= 0) {
        alert('กรุณากรอกน้ำหนักและส่วนสูงให้ถูกต้อง');
        return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let label = '';
    let color = '';
    if (bmi < 18.5) {
        label = 'น้ำหนักน้อย';
        color = '#2196F3';
    } else if (bmi < 23) {
        label = 'ปกติ';
        color = '#4CAF50';
    } else if (bmi < 25) {
        label = 'น้ำหนักเกิน';
        color = '#FF9800';
    } else if (bmi < 30) {
        label = 'อ้วนระดับ 1';
        color = '#FF5722';
    } else {
        label = 'อ้วนระดับ 2';
        color = '#D32F2F';
    }

    const resultBox = document.getElementById('bmi-result');
    document.getElementById('bmi-value').textContent = bmi.toFixed(1);
    document.getElementById('bmi-value').style.color = color;
    document.getElementById('bmi-label').textContent = label;
    resultBox.style.display = 'block';

    // Store current BMI for saving
    window.currentBMI = { bmi: bmi.toFixed(1), weight, height };
}

function saveBMI() {
    if (!window.currentBMI) return;

    const entry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        weight: window.currentBMI.weight,
        bmi: parseFloat(window.currentBMI.bmi)
    };

    storage.addLogEntry(entry);
    alert('บันทึก BMI สำเร็จ!');
    document.getElementById('bmi-weight').value = '';
    document.getElementById('bmi-height').value = '';
    document.getElementById('bmi-result').style.display = 'none';
}

// TDEE Calculator
function calculateTDEE() {
    const gender = document.querySelector('input[name="tdee-gender"]:checked').value;
    const age = parseFloat(document.getElementById('tdee-age').value);
    const weight = parseFloat(document.getElementById('tdee-weight').value);
    const height = parseFloat(document.getElementById('tdee-height').value);
    const activity = parseFloat(document.querySelector('input[name="tdee-activity"]:checked').value);

    if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    // Calculate BMR
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calculate TDEE
    const tdee = Math.round(bmr * activity);

    // Show results
    document.getElementById('tdee-bmr').textContent = Math.round(bmr) + ' cal/วัน';
    document.getElementById('tdee-value').textContent = tdee + ' cal/วัน';
    document.getElementById('tdee-deficit').textContent = (tdee - 500) + ' cal/วัน';
    document.getElementById('tdee-surplus').textContent = (tdee + 500) + ' cal/วัน';
    document.getElementById('tdee-result').style.display = 'block';
}

// Workout Plans
const workoutPlans = {
    'weight-loss': {
        title: 'โปรแกรมลดน้ำหนัก',
        exercises: [
            { name: 'วิ่งหรือเดินเร็ว', sets: 3, reps: '20 นาที', time: '30 นาที' },
            { name: 'Jumping Jacks', sets: 3, reps: 20, time: '20 นาที' },
            { name: 'Burpees', sets: 3, reps: 15, time: '20 นาที' },
            { name: 'Mountain Climbers', sets: 3, reps: 30, time: '20 นาที' },
            { name: 'High Knees', sets: 3, reps: '30 วินาที', time: '15 นาที' },
            { name: 'Jump Rope', sets: 3, reps: '1 นาที', time: '20 นาที' }
        ]
    },
    'muscle-gain': {
        title: 'โปรแกรมเพิ่มกล้ามเนื้อ',
        exercises: [
            { name: 'Push-ups', sets: 4, reps: 12, time: '30 นาที' },
            { name: 'Squats', sets: 4, reps: 15, time: '30 นาที' },
            { name: 'Dumbbell Bench Press', sets: 4, reps: 10, time: '35 นาที' },
            { name: 'Deadlifts', sets: 3, reps: 8, time: '30 นาที' },
            { name: 'Pull-ups', sets: 3, reps: 8, time: '25 นาที' },
            { name: 'Dumbbell Rows', sets: 4, reps: 12, time: '30 นาที' }
        ]
    },
    'strength': {
        title: 'โปรแกรมเพิ่มความแข็งแรง',
        exercises: [
            { name: 'Barbell Squats', sets: 5, reps: 5, time: '40 นาที' },
            { name: 'Barbell Bench Press', sets: 5, reps: 5, time: '40 นาที' },
            { name: 'Barbell Deadlifts', sets: 3, reps: 5, time: '35 นาที' },
            { name: 'Barbell Rows', sets: 5, reps: 5, time: '40 นาที' },
            { name: 'Weighted Dips', sets: 3, reps: 8, time: '30 นาที' },
            { name: 'Weighted Pull-ups', sets: 3, reps: 8, time: '30 นาที' }
        ]
    },
    'general': {
        title: 'โปรแกรมสุขภาพทั่วไป',
        exercises: [
            { name: 'เดินเร็ว', sets: 1, reps: '30 นาที', time: '30 นาที' },
            { name: 'Yoga', sets: 1, reps: '20 ท่า', time: '45 นาที' },
            { name: 'Stretching', sets: 1, reps: '10 ท่า', time: '15 นาที' },
            { name: 'Swimming', sets: 1, reps: '20 นาที', time: '30 นาที' },
            { name: 'Cycling', sets: 1, reps: '30 นาที', time: '40 นาที' },
            { name: 'Dancing', sets: 1, reps: '30 นาที', time: '45 นาที' }
        ]
    }
};

function showWorkoutPlan(goal) {
    const plan = workoutPlans[goal];
    document.getElementById('workout-title').textContent = plan.title;

    const exercisesHTML = plan.exercises.map(ex => `
        <div class="exercise-item">
            <div class="exercise-name">💪 ${ex.name}</div>
            <div class="exercise-details">
                เซต: ${ex.sets} | ครั้ง: ${ex.reps} | เวลา: ${ex.time}
            </div>
        </div>
    `).join('');

    document.getElementById('workout-exercises').innerHTML = exercisesHTML;
    document.getElementById('workout-plan').style.display = 'block';

    // Scroll to plan
    document.getElementById('workout-plan').scrollIntoView({ behavior: 'smooth' });
}

function recordWorkoutDay() {
    storage.addWorkoutDay();
    alert('บันทึกวันออกกำลังกายสำเร็จ! 🎉');
}

// Log Management
function addLogEntry() {
    const weight = parseFloat(document.getElementById('log-weight').value);

    if (!weight || weight <= 0) {
        alert('กรุณากรอกน้ำหนักให้ถูกต้อง');
        return;
    }

    const entry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        weight: weight,
        bmi: 0 // Can be calculated if height is available
    };

    storage.addLogEntry(entry);
    document.getElementById('log-weight').value = '';
    loadLogEntries();
    alert('บันทึกสำเร็จ!');
}

function loadLogEntries() {
    const entries = storage.getLogEntries();
    const listHTML = entries.reverse().map(entry => `
        <div class="log-item">
            <div>
                <div class="log-date">${entry.date}</div>
                <div class="log-weight">${entry.weight} กก.</div>
            </div>
            <button class="log-delete" onclick="deleteLogEntry(${entry.id})">ลบ</button>
        </div>
    `).join('');

    document.getElementById('log-entries').innerHTML = listHTML || '<p style="text-align:center; color: #999;">ยังไม่มีรายการบันทึก</p>';
}

function deleteLogEntry(id) {
    if (confirm('ต้องการลบรายการนี้ใหม่?')) {
        let entries = storage.getLogEntries();
        entries = entries.filter(e => e.id !== id);
        localStorage.setItem('fitteen_logs', JSON.stringify(entries));
        loadLogEntries();
    }
}

// Statistics
function loadStats() {
    const entries = storage.getLogEntries();
    const workouts = storage.getWorkoutDays();

    // Update summary
    document.getElementById('stat-entries').textContent = entries.length;
    document.getElementById('stat-workouts').textContent = workouts.length;

    if (entries.length >= 2) {
        const firstWeight = entries[0].weight;
        const lastWeight = entries[entries.length - 1].weight;
        const change = (lastWeight - firstWeight).toFixed(1);
        document.getElementById('stat-change').textContent = (change > 0 ? '+' : '') + change + ' กก.';
    }

    // Draw charts
    drawWeightChart(entries);
    drawBMIChart(entries);
}

function drawWeightChart(entries) {
    const canvas = document.getElementById('weight-chart');
    const ctx = canvas.getContext('2d');

    if (entries.length < 2) {
        ctx.fillStyle = '#999';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ต้องการข้อมูลอย่างน้อย 2 รายการ', canvas.width / 2, canvas.height / 2);
        return;
    }

    const weights = entries.map(e => e.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const range = maxWeight - minWeight || 1;

    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = '#DDD';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = '#D32F2F';
    ctx.lineWidth = 2;
    ctx.beginPath();

    weights.forEach((weight, i) => {
        const x = padding + (i / (weights.length - 1)) * width;
        const y = canvas.height - padding - ((weight - minWeight) / range) * height;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#D32F2F';
    weights.forEach((weight, i) => {
        const x = padding + (i / (weights.length - 1)) * width;
        const y = canvas.height - padding - ((weight - minWeight) / range) * height;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#999';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(minWeight.toFixed(1), padding - 30, canvas.height - padding + 5);
    ctx.fillText(maxWeight.toFixed(1), padding - 30, padding + 5);
}

function drawBMIChart(entries) {
    const canvas = document.getElementById('bmi-chart');
    const ctx = canvas.getContext('2d');

    const bmiEntries = entries.filter(e => e.bmi > 0);

    if (bmiEntries.length < 2) {
        ctx.fillStyle = '#999';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ต้องการข้อมูล BMI อย่างน้อย 2 รายการ', canvas.width / 2, canvas.height / 2);
        return;
    }

    const bmis = bmiEntries.map(e => e.bmi);
    const minBMI = Math.min(...bmis);
    const maxBMI = Math.max(...bmis);
    const range = maxBMI - minBMI || 1;

    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = '#DDD';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = '#7B1FA2';
    ctx.lineWidth = 2;
    ctx.beginPath();

    bmis.forEach((bmi, i) => {
        const x = padding + (i / (bmis.length - 1)) * width;
        const y = canvas.height - padding - ((bmi - minBMI) / range) * height;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#7B1FA2';
    bmis.forEach((bmi, i) => {
        const x = padding + (i / (bmis.length - 1)) * width;
        const y = canvas.height - padding - ((bmi - minBMI) / range) * height;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Profile Management
function loadProfile() {
    const profile = storage.getProfile();
    document.getElementById('profile-name').value = profile.name;
    document.getElementById('profile-age').value = profile.age;
    document.getElementById('profile-height').value = profile.height;
    document.getElementById('profile-weight').value = profile.weight;
    document.getElementById('profile-goal').value = profile.goal;
    document.querySelector(`input[name="profile-gender"][value="${profile.gender}"]`).checked = true;
}

function saveProfile() {
    const profile = {
        name: document.getElementById('profile-name').value,
        age: document.getElementById('profile-age').value,
        gender: document.querySelector('input[name="profile-gender"]:checked').value,
        height: document.getElementById('profile-height').value,
        weight: document.getElementById('profile-weight').value,
        goal: document.getElementById('profile-goal').value
    };

    storage.saveProfile(profile);
    alert('บันทึกโปรไฟล์สำเร็จ!');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    // Set first nav link as active
    document.querySelector('.nav-link').classList.add('active');
});
