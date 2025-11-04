// ملف JavaScript لإدارة المحتوى من JSON

// تحميل البيانات من JSON
let siteData = null;

// تحميل البيانات عند بدء التشغيل
async function loadData() {
    try {
        console.log('🔄 بدء تحميل البيانات...');
        const response = await fetch('data.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        siteData = await response.json();
        console.log('✅ تم تحميل البيانات بنجاح');
        console.log('📊 تفاصيل البيانات:', {
            specialties: Object.keys(siteData.specialties || {}).length,
            courses: Object.keys(siteData.courses || {}).length,
            faculty: Object.keys(siteData.faculty || {}).length,
            statistics: (siteData.statistics || []).length
        });

        // ملء البيانات في الصفحة
        populatePageData();

        return true;
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);

        // إظهار رسالة خطأ للمستخدم
        showErrorMessage('حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى أو التواصل مع الدعم التقني.');

        return false;
    }
}

// دالة إظهار رسالة خطأ
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-triangle ml-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="mr-2 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(errorDiv);

    // إزالة الرسالة تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// دالة ملء البيانات في الصفحة
function populatePageData() {
    if (!siteData) {
        console.log('⚠️ لا توجد بيانات لملء الصفحة');
        return;
    }

    console.log('📄 بدء ملء البيانات في الصفحة...');

    // التحقق من سلامة البيانات
    if (!validateData()) {
        console.warn('⚠️ توجد مشاكل في البيانات، سيتم المتابعة بالبيانات المتاحة');
    }

    // عرض إحصائيات البيانات
    console.log('📊 إحصائيات البيانات:', getDataStatistics());

    // تحديث عنوان الصفحة
    // document.title = siteData.siteInfo.title;

    // تحديث الإحصائيات
    updateStatistics();

    // إنشاء قسم الإحصائيات
    // createStatisticsSection();

    // ملء بيانات التخصصات
    populateSpecialties();

    // ملء بيانات أعضاء هيئة التدريس
    populateFaculty();

    // تحديث الروابط الخارجية
    updateExternalLinks();

    // إضافة تأثيرات التفاعل بعد ملء البيانات
    setTimeout(() => {
        addCardInteractions();
        revealOnScroll(); // التحقق الأولي من العناصر المرئية
    }, 100);

    console.log('✅ تم ملء البيانات بنجاح');
}

// تحديث الإحصائيات
function updateStatistics() {
    // إصلاح: الإحصائيات موجودة في siteData.statistics وليس siteData.siteInfo.statistics
    const stats = siteData.statistics;

    console.log('📊 الإحصائيات:', stats);

    // البحث عن عناصر الإحصائيات وتحديثها
    const statElements = document.querySelectorAll('[data-stat]');
    console.log('🔍 عدد عناصر الإحصائيات:', statElements.length);

    statElements.forEach(element => {
        const statType = element.getAttribute('data-stat');
        const statObj = stats.find(stat => stat.title === statType);
        if (statObj) {
            element.textContent = statObj.description;
            console.log(`✓ تحديث ${statType}: ${statObj.description}`);
        }
    });

    // ملء معلومات الموقع الأساسية
    updateSiteInfo();
}

// دالة جديدة لتحديث معلومات الموقع الأساسية
function updateSiteInfo() {
    // تحديث العنوان الرئيسي
    const mainTitle = document.querySelector('h1');
    if (mainTitle && siteData.siteInfo.title) {
        const titleText = mainTitle.textContent;
        if (titleText.includes('عمادة')) {
            mainTitle.textContent = siteData.siteInfo.title;
        }
    }

    // تحديث الشعار والعناوين الفرعية
    const clubName = document.querySelector('.font-bold.text-lg.text-white');
    const clubTagline = document.querySelector('.text-white.opacity-80');

    if (clubName) clubName.textContent = siteData.siteInfo.clubName;
    if (clubTagline) clubTagline.textContent = siteData.siteInfo.clubTagline;

    // تحديث الشعار
    const logo = document.querySelector('img[alt="ucas eng club"]');
    if (logo && siteData.siteInfo.logo) {
        logo.src = siteData.siteInfo.logo;
    }

    console.log('✅ تم تحديث معلومات الموقع الأساسية');
}

// دالة ملء بيانات التخصصات
function populateSpecialties() {
    const specialtiesSection = document.querySelector('.grid.md\\:grid-cols-2.gap-8.mb-16');
    if (!specialtiesSection) {
        console.log('⚠️ لم يتم العثور على قسم التخصصات');
        return;
    }

    // تنظيف المحتوى الحالي
    specialtiesSection.innerHTML = '';

    // إضافة كل تخصص
    Object.values(siteData.specialties).forEach(specialty => {
        const specialtyCard = createSpecialtyCard(specialty);
        specialtiesSection.appendChild(specialtyCard);
    });

    console.log('✅ تم ملء بيانات التخصصات');
}

// دالة إنشاء بطاقة التخصص
function createSpecialtyCard(specialty) {
    const card = document.createElement('div');
    card.className = 'specialty-card bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white border-opacity-50 cursor-pointer';
    card.onclick = () => exploreSpecialty(specialty.id);

    card.innerHTML = `
        <div class="text-center mb-6">
            <div class="text-6xl mb-4 text-${specialty.color}">
                <i class="fas ${specialty.icon}"></i>
            </div>
            <h2 class="text-3xl font-bold text-${specialty.color} mb-2">${specialty.name}</h2>
            <div class="flex justify-center items-center space-x-4 space-x-reverse text-sm text-gray-600">
                <span><i class="fas fa-graduation-cap ml-1"></i> ${specialty.degree}</span>
                <span><i class="fas fa-clock ml-1"></i> ${specialty.duration}</span>
            </div>
        </div>
        
        <div class="space-y-4">
            <div class="bg-purple-50 p-4 rounded-xl">
                <h3 class="font-bold text-gray-800 mb-2 flex items-center">
                    <i class="fas fa-lightbulb text-${specialty.color} ml-2"></i> ماذا ستتعلم؟
                </h3>
                <ul class="space-y-1">
                    ${specialty.learningPoints.map(point => `
                        <li class="text-gray-600 text-sm flex items-center">
                            <i class="fas fa-check text-${specialty.color} ml-2 text-xs"></i>
                            ${point}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-xl">
                <h3 class="font-bold text-gray-800 mb-2 flex items-center">
                    <i class="fas fa-briefcase text-${specialty.color} ml-2"></i> فرص العمل
                </h3>
                <ul class="space-y-1">
                    ${specialty.careers.slice(0, 3).map(career => `
                        <li class="text-gray-600 text-sm flex items-center">
                            <i class="fas fa-arrow-left text-${specialty.color} ml-2 text-xs"></i>
                            ${career}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div class="text-center mt-6">
            <div class="bg-${specialty.color} text-white px-6 py-3 rounded-full inline-flex items-center">
                <span class="ml-2">استكشف التخصص</span>
                <i class="fas fa-arrow-left"></i>
            </div>
        </div>
    `;

    return card;
}

// دالة ملء بيانات أعضاء هيئة التدريس
function populateFaculty() {
    // ملء بيانات رئيس القسم
    const headSection = document.querySelector('.mb-12 .flex.justify-center.head');
    if (headSection && siteData.faculty.head) {
        siteData.faculty.head.id = 'head'; // إضافة الـ id لرئيس القسم
        const headCard = createFacultyCard(siteData.faculty.head, true);
        headSection.innerHTML = '';
        headSection.appendChild(headCard);
    }

    // ملء بيانات أعضاء هيئة التدريس
    const facultyGrid = document.querySelector('.grid.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8');
    if (facultyGrid) {
        facultyGrid.innerHTML = '';

        // إضافة جميع أعضاء هيئة التدريس عدا رئيس القسم
        Object.entries(siteData.faculty).forEach(([id, faculty]) => {
            if (id !== 'head') {
                faculty.id = id; // إضافة الـ id للعضو
                const facultyCard = createFacultyCard(faculty, false);
                facultyGrid.appendChild(facultyCard);
            }
        });
    }

    console.log('✅ تم ملء بيانات أعضاء هيئة التدريس');
}

// دالة تحديث الروابط الخارجية
function updateExternalLinks() {
    if (!siteData.links) return;

    // تحديث رابط التقديم
    const applyLinks = document.querySelectorAll('a[href*="application"], .apply-btn');
    applyLinks.forEach(link => {
        if (siteData.links.apply) {
            link.href = siteData.links.apply;
        }
    });

    // تحديث رابط معرفة المزيد
    const learnMoreLinks = document.querySelectorAll('a[href*="department"], .learn-more-btn');
    learnMoreLinks.forEach(link => {
        if (siteData.links.learnMore) {
            link.href = siteData.links.learnMore;
        }
    });

    console.log('✅ تم تحديث الروابط الخارجية');
}

// دالة إنشاء محتوى الإحصائيات ديناميكياً
function createStatisticsSection() {
    const statsSection = document.querySelector('.bg-white.bg-opacity-10.backdrop-blur-sm.rounded-3xl.p-8.mb-16.reveal-animation');
    if (!statsSection || !siteData.statistics) return;

    const statsGrid = statsSection.querySelector('.grid.md\\:grid-cols-4.gap-6.text-center');
    if (!statsGrid) return;

    // تنظيف المحتوى الحالي
    statsGrid.innerHTML = '';

    // إضافة إحصائيات من البيانات
    siteData.statistics.forEach(stat => {
        const statCard = document.createElement('div');
        statCard.className = 'bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6';

        statCard.innerHTML = `
            <div class="text-4xl text-white mb-4">
                <i class="fas ${stat.icon}"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">${stat.title}</h3>
            <p class="text-white opacity-80 text-sm">${stat.description}</p>
        `;

        statsGrid.appendChild(statCard);
    });

    // إضافة إحصائية إضافية لعدد التخصصات
    const specialtiesCount = Object.keys(siteData.specialties).length;
    const specialtiesStat = document.createElement('div');
    specialtiesStat.className = 'bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6';

    specialtiesStat.innerHTML = `
        <div class="text-4xl text-white mb-4">
            <i class="fas fa-laptop-code"></i>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">${specialtiesCount} تخصصات</h3>
        <p class="text-white opacity-80 text-sm">تخصصات متنوعة في التكنولوجيا</p>
    `;

    statsGrid.appendChild(specialtiesStat);

    console.log('✅ تم إنشاء قسم الإحصائيات');
}

// دالة إنشاء بطاقة عضو هيئة التدريس
function createFacultyCard(faculty, isHead = false) {
    const card = document.createElement('div');
    
    // إضافة cursor-pointer فقط إذا لم يكن معطلاً
    const cursorClass = faculty.disabled ? '' : 'cursor-pointer';
    card.className = `faculty-card bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white border-opacity-50 relative overflow-hidden ${cursorClass} ${isHead ? 'max-w-md mx-auto' : ''}`;
    
    // إضافة onclick فقط إذا لم يكن معطلاً
    if (!faculty.disabled) {
        card.onclick = () => showFacultyDetails(faculty.id);
    }

    // عرض الصورة إذا كانت متوفرة، وإلا استخدام الأيقونة
    const imageHTML = faculty.image ? `
        <img src="${faculty.image}" alt="${faculty.name}" class="w-full h-full object-cover rounded-full" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="w-full h-full rounded-full bg-gray-200 items-center justify-center hidden">
            <i class="fas fa-user text-2xl text-gray-600"></i>
        </div>
    ` : `
        <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
            <i class="fas fa-user text-2xl text-gray-600"></i>
        </div>
    `;

    x = `
        <div class="text-center">
            <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${faculty.gradient} p-1 mb-4 shadow-lg">
                ${imageHTML}
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">${faculty.name}</h3>
            <p class="text-sm text-blue-600 font-medium mb-2">${faculty.position}</p>
            
            ${faculty.qualification ? `
                <div class="inline-flex items-center bg-gradient-to-r ${faculty.gradient} text-white px-3 py-1 rounded-full text-xs mb-3">
                    <i class="fas fa-graduation-cap ml-1"></i>
                    ${faculty.qualification}
                </div>
            ` : ''}
            
            ${faculty.badge ? `
                <div class="inline-flex items-center bg-gradient-to-r ${faculty.gradient} text-white px-3 py-1 rounded-full text-xs mb-3">
                    <i class="fas fa-star ml-1"></i>
                    ${faculty.badge}
                </div>
            ` : ''}
            
            <div class="bg-gray-50 p-3 rounded-xl mb-3">
            `
    if (isHead) {
        x = x + `<p class="text-xs text-gray-600 flex items-center justify-center mb-1">
                    <i class="fas fa-graduation-cap text-blue-500 ml-1"></i>
                    ${faculty.experience}
                </p>`
    }
    x = x + `
                
                <p class="text-xs text-gray-700">${faculty.specialization}</p>
            </div>
            
            <div class="text-xs text-gray-600">
                <p class="flex items-center justify-center">
                    <i class="fas fa-envelope text-green-500 ml-1"></i>
                    ${faculty.email}
                </p>
            </div>
        </div>
    `
    card.innerHTML = x;

    return card;
}

// دالة استكشاف التخصص (محدثة لاستخدام JSON)
function exploreSpecialty(specialtyId) {
    if (!siteData || !siteData.specialties || !siteData.specialties[specialtyId]) {
        console.error('لا يمكن تحميل بيانات التخصص');
        return;
    }

    const specialty = siteData.specialties[specialtyId];
    const modal = document.getElementById('specialtyModal');
    const content = document.getElementById('specialtyModalContent');

    document.body.classList.add('modal-open');

    // بناء HTML للمساقات
    const coursesHTML = specialty.courses.map(courseId => {
        const course = siteData.courses[courseId];
        if (!course) return '';

        return `
            <div class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer" 
                 onclick="closeSpecialtyModal(); showCourseDetails('${courseId}')">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-${specialty.color}-600 font-bold">${course.code}</span>
                    <span class="text-gray-600 text-sm">${course.hours}</span>
                </div>
                <h4 class="font-semibold text-gray-800">${course.name}</h4>
            </div>
        `;
    }).join('');

    content.innerHTML = `
        <div class="text-center mb-6">
            <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${specialty.gradient} flex items-center justify-center mb-4">
                <i class="fas ${specialty.icon} text-3xl text-white"></i>
            </div>
            <h2 class="text-3xl font-bold text-${specialty.color}-600 mb-2">${specialty.name}</h2>
            <p class="text-gray-600">${specialty.subtitle}</p>
        </div>

        
        
        <div class="bg-${specialty.color}-50 p-6 rounded-xl mb-6">
            <h3 class="text-xl font-bold text-${specialty.color}-800 mb-3">نظرة عامة</h3>
            <p class="text-gray-700">${specialty.overview}</p>
        </div>

        <!-- معلومات منسق التخصص -->
        ${specialty.coordinator ? `
        <div class="bg-${specialty.color}-50 p-6 rounded-xl mb-6">
            <h3 class="text-xl font-bold text-${specialty.color}-800 mb-4 flex items-center">
                منسق التخصص
            </h3>
            <div class="flex">
                <div class="flex p-4 bg-blue-400/20 rounded-xl flex-col">
                    <h4 class="text-lg font-bold text-${specialty.color}-700 mb-2"> <i class="fas fa-user-tie ml-2"></i> ${specialty.coordinator.name}</h4>
                    <p class="text-sm text-${specialty.color}-600 mb-2">${specialty.coordinator.title}</p>
                    <div class="flex items-center text-${specialty.color}-600">
                        <i class="fas fa-envelope ml-2"></i>
                        <a href="mailto:${specialty.coordinator.email}" class="hover:underline">${specialty.coordinator.email}</a>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}
        
        <div class="mb-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">مجالات العمل</h3>
            <div class="grid md:grid-cols-2 gap-4">
                ${specialty.careers.map(career => `
                    <div class="bg-gradient-to-r ${specialty.gradient} p-4 rounded-lg text-white">
                        <i class="fas fa-briefcase ml-2"></i>
                        ${career}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="mb-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">المهارات المكتسبة</h3>
            <div class="grid md:grid-cols-2 gap-3">
                ${specialty.skills.map(skill => `
                    <div class="flex items-start bg-gray-50 p-3 rounded-lg">
                        <i class="fas fa-check-circle text-${specialty.color}-600 ml-2 mt-1"></i>
                        <span class="text-gray-700">${skill}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">أبرز المساقات الدراسية</h3>
            <div class="grid md:grid-cols-2 gap-4">
                ${coursesHTML}
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

// إغلاق نافذة التخصص
function closeSpecialtyModal() {
    const modal = document.getElementById('specialtyModal');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// دالة عرض تفاصيل المساق (محدثة لاستخدام JSON)
function showCourseDetails(courseId) {
    const modal = document.getElementById('courseModal');
    const content = document.getElementById('courseModalContent');

    // منع التمرير في الخلفية
    document.body.classList.add('modal-open');

    // التحقق من تحميل البيانات
    if (!siteData || !siteData.courses || !siteData.courses[courseId]) {
        content.innerHTML = '<p class="text-center text-red-600">عذراً، لا يمكن تحميل بيانات المساق</p>';
        modal.classList.remove('hidden');
        return;
    }

    const course = siteData.courses[courseId];

    content.innerHTML = `
        <div class="text-center mb-6">
            <div class="inline-flex items-center bg-cyber-purple text-white px-4 py-2 rounded-full text-sm mb-4">
                <i class="fas fa-book ml-2"></i>
                ${course.code}
            </div>
            <h2 class="text-2xl font-bold text-cyber-purple mb-2">${course.name}</h2>
            <p class="text-gray-600">${course.hours}</p>
        </div>
        
        <div class="bg-purple-50 p-6 rounded-xl mb-6">
            <h3 class="text-lg font-bold text-cyber-purple mb-3 flex items-center">
                <i class="fas fa-info-circle ml-2"></i> وصف المساق
            </h3>
            <p class="text-gray-700">${course.description}</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-blue-50 p-6 rounded-xl">
                <h3 class="text-lg font-bold text-blue-800 mb-3 flex items-center">
                    <i class="fas fa-bullseye ml-2"></i> أهداف المساق
                </h3>
                <ul class="space-y-2">
                    ${course.objectives.map(obj => `
                        <li class="text-gray-700 flex items-start">
                            <i class="fas fa-check-circle text-blue-600 ml-2 mt-1"></i>
                            <span>${obj}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="bg-green-50 p-6 rounded-xl">
                <h3 class="text-lg font-bold text-green-800 mb-3 flex items-center">
                    <i class="fas fa-list-ul ml-2"></i> المواضيع
                </h3>
                <ul class="space-y-2">
                    ${course.topics.map(topic => `
                        <li class="text-gray-700 flex items-start">
                            <i class="fas fa-arrow-left text-green-600 ml-2 mt-1"></i>
                            <span>${topic}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

// إغلاق نافذة المساق
function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// دالة عرض تفاصيل عضو هيئة التدريس (محدثة لاستخدام JSON)
function showFacultyDetails(facultyId) {
    const modal = document.getElementById('facultyModal');
    const content = document.getElementById('facultyModalContent');

    // منع التمرير في الخلفية
    document.body.classList.add('modal-open');

    // التحقق من تحميل البيانات وصحة المعرف
    if (!siteData || !siteData.faculty) {
        console.error('البيانات غير متوفرة');
        content.innerHTML = '<p class="text-center text-red-600">عذراً، البيانات غير متوفرة</p>';
        modal.classList.remove('hidden');
        return;
    }

    // البحث عن عضو هيئة التدريس إما بالمعرف المباشر أو في المصفوفة
    let faculty;
    if (siteData.faculty[facultyId]) {
        faculty = siteData.faculty[facultyId];
        
        // التحقق إذا كان العضو معطل (disabled)
        if (faculty.disabled) {
            console.log('هذا العضو غير متاح للعرض');
            return;
        }
    } else {
        // البحث في مصفوفة الأعضاء
        faculty = Object.values(siteData.faculty).find(f => f.id === facultyId);
    }

    if (!faculty) {
        console.error('لا يمكن تحميل بيانات عضو هيئة التدريس:', facultyId);
        content.innerHTML = '<p class="text-center text-red-600">عذراً، لا يمكن تحميل بيانات عضو هيئة التدريس</p>';
        modal.classList.remove('hidden');
        return;
    }

    // تحضير الصورة
    const imageHTML = faculty.image ? `
        <img src="${faculty.image}" alt="${faculty.name}" class="w-full h-full object-cover rounded-full" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="w-full h-full rounded-full bg-gray-200 items-center justify-center hidden">
            <i class="fas fa-user text-5xl text-gray-600"></i>
        </div>
    ` : `
        <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
            <i class="fas fa-user text-5xl text-gray-600"></i>
        </div>
    `;

    // تحضير محتوى الـ modal
    let modalContent = `
        <div class="text-center mb-6">
            <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${faculty.gradient || 'from-blue-500 to-blue-700'} p-2 mb-4 shadow-xl">
                ${imageHTML}
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${faculty.name || 'غير محدد'}</h2>
            <p class="text-lg text-blue-600 font-medium mb-2">${faculty.position || 'غير محدد'}</p>
            ${faculty.qualification ? `
                <div class="inline-flex items-center bg-gradient-to-r ${faculty.gradient || 'from-blue-500 to-blue-700'} text-white px-4 py-1 rounded-full text-sm">
                    <i class="fas fa-graduation-cap ml-2"></i>
                    ${faculty.qualification}
                </div>
            ` : ''}
        </div>
        
        <div class="space-y-6">
            <!-- البريد الإلكتروني والتخصص في الأعلى جنباً إلى جنب -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${faculty.email ? `
                    <div class="bg-green-50 p-4 rounded-xl">
                        <h3 class="font-bold text-green-800 mb-2 flex items-center">
                            <i class="fas fa-envelope text-green-600 ml-2"></i> البريد الإلكتروني
                        </h3>
                        <a href="mailto:${faculty.email}" class="text-green-700 text-sm break-all hover:text-green-900 hover:underline transition-colors duration-200">${faculty.email}</a>
                    </div>
                ` : ''}
                ${faculty.specialization ? `
                    <div class="bg-purple-50 p-4 rounded-xl">
                        <h3 class="font-bold text-purple-800 mb-2 flex items-center">
                            <i class="fas fa-star text-purple-600 ml-2"></i> التخصص
                        </h3>
                        <p class="text-purple-700">${faculty.specialization}</p>
                    </div>
                ` : ''}
            </div>
            
            ${faculty.bio ? `
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-xl border-r-4 border-blue-500">
                    <h3 class="font-bold text-gray-800 mb-3 flex items-center text-lg">
                        <i class="fas fa-user-circle text-blue-600 ml-2"></i> نبذة تعريفية
                    </h3>
                    <p class="text-gray-700 leading-relaxed whitespace-pre-line">${faculty.bio}</p>
                </div>
            ` : ''}
            
            ${faculty.message ? `
                <div class="bg-gradient-to-r from-green-50 to-teal-50 p-5 rounded-xl border-r-4 border-green-500">
                    <h3 class="font-bold text-gray-800 mb-3 flex items-center text-lg">
                        <i class="fas fa-comment-dots text-green-600 ml-2"></i> كلمة موجهة للطلبة
                    </h3>
                    <p class="text-gray-700 leading-relaxed whitespace-pre-line">${faculty.message}</p>
                </div>
            ` : ''}
            
            ${faculty.degree ? `
                <div class="bg-gray-50 p-4 rounded-xl">
                    <h3 class="font-bold text-gray-800 mb-2 flex items-center">
                        <i class="fas fa-graduation-cap text-blue-600 ml-2"></i> الدرجة العلمية
                    </h3>
                    <p class="text-gray-600">${faculty.degree}</p>
                </div>
            ` : ''}
            
            ${faculty.officeHours ? `
                <div class="bg-blue-50 p-4 rounded-xl">
                    <h3 class="font-bold text-blue-800 mb-2 flex items-center">
                        <i class="fas fa-clock text-blue-600 ml-2"></i> الساعات المكتبية
                    </h3>
                    <p class="text-blue-700">${faculty.officeHours}</p>
                </div>
            ` : ''}
            
            ${faculty.officeNumber ? `
                <div class="bg-gray-50 p-4 rounded-xl">
                    <h3 class="font-bold text-gray-800 mb-2 flex items-center">
                        <i class="fas fa-map-marker-alt text-gray-600 ml-2"></i> رقم المكتب
                    </h3>
                    <p class="text-gray-600">${faculty.officeNumber}</p>
                </div>
            ` : ''}
            
            ${faculty.research && faculty.research.length > 0 ? `
                <div class="bg-yellow-50 p-4 rounded-xl">
                    <h3 class="font-bold text-yellow-800 mb-3 flex items-center">
                        <i class="fas fa-microscope text-yellow-600 ml-2"></i> مجالات البحث
                    </h3>
                    <ul class="space-y-2">
                        ${faculty.research.map(field => `
                            <li class="text-yellow-700 flex items-start">
                                <i class="fas fa-flask text-yellow-600 ml-2 mt-1 text-sm"></i>
                                <span>${field}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${faculty.publications && faculty.publications.length > 0 ? `
                <div class="bg-indigo-50 p-4 rounded-xl">
                    <h3 class="font-bold text-indigo-800 mb-3 flex items-center">
                        <i class="fas fa-scroll text-indigo-600 ml-2"></i> المنشورات البحثية
                    </h3>
                    <ul class="space-y-2">
                        ${faculty.publications.map(pub => `
                            <li class="text-indigo-700 flex items-center">
                                <i class="fas fa-file-alt text-indigo-600 ml-2"></i>
                                <span>${pub}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${faculty.awards && faculty.awards.length > 0 ? `
                <div class="bg-yellow-50 p-4 rounded-xl">
                    <h3 class="font-bold text-yellow-800 mb-3 flex items-center">
                        <i class="fas fa-trophy text-yellow-600 ml-2"></i> الجوائز والإنجازات
                    </h3>
                    <ul class="space-y-2">
                        ${faculty.awards.map(award => `
                            <li class="text-yellow-700 flex items-start">
                                <i class="fas fa-medal text-yellow-600 ml-2 mt-1 text-sm"></i>
                                <span>${award}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;

    content.innerHTML = modalContent;

    modal.classList.remove('hidden');
}

// إغلاق نافذة عضو هيئة التدريس
function closeFacultyModal() {
    const modal = document.getElementById('facultyModal');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// تحميل البيانات عند جاهزية الصفحة
document.addEventListener('DOMContentLoaded', function () {
    loadData();

    // إضافة مستمعي الأحداث
    addEventListeners();
});

// دالة تحديث شريط التقدم
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    progressBar.style.width = scrollPercent + '%';
}

// دالة إظهار العناصر عند التمرير
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal-animation');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// دالة إضافة تأثيرات التفاعل للبطاقات
function addCardInteractions() {
    const cards = document.querySelectorAll('.specialty-card, .faculty-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.classList.add('active');
        });

        card.addEventListener('mouseleave', function () {
            this.classList.remove('active');
        });
    });
}

// دالة البحث في المساقات
function searchCourses(query) {
    if (!query || !siteData.courses) return [];

    return Object.values(siteData.courses).filter(course =>
        course.name.includes(query) ||
        course.code.includes(query) ||
        course.description.includes(query)
    );
}

// دالة البحث في أعضاء هيئة التدريس
function searchFaculty(query) {
    if (!query || !siteData.faculty) return [];

    return Object.values(siteData.faculty).filter(faculty =>
        faculty.name.includes(query) ||
        faculty.specialization.includes(query) ||
        faculty.position.includes(query)
    );
}

// دالة إضافة مستمعي الأحداث
function addEventListeners() {
    // مستمع التمرير لشريط التقدم والرسوم المتحركة
    window.addEventListener('scroll', function () {
        updateProgressBar();
        revealOnScroll();
    });

    // مستمع لإغلاق النوافذ المنبثقة بالضغط على Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeFacultyModal();
            closeSpecialtyModal();
            closeCourseModal();
        }
    });

    // مستمع للنقر خارج النافذة المنبثقة لإغلاقها
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeFacultyModal();
            closeSpecialtyModal();
            closeCourseModal();
        }
    });
}

// دالة التحقق من سلامة البيانات
function validateData() {
    if (!siteData) {
        console.warn('⚠️ البيانات غير محملة');
        return false;
    }

    const issues = [];

    // التحقق من معلومات الموقع
    if (!siteData.siteInfo) {
        issues.push('معلومات الموقع مفقودة');
    }

    // التحقق من التخصصات
    if (!siteData.specialties || Object.keys(siteData.specialties).length === 0) {
        issues.push('بيانات التخصصات مفقودة');
    }

    // التحقق من المساقات
    if (!siteData.courses || Object.keys(siteData.courses).length === 0) {
        issues.push('بيانات المساقات مفقودة');
    }

    // التحقق من أعضاء هيئة التدريس
    if (!siteData.faculty || Object.keys(siteData.faculty).length === 0) {
        issues.push('بيانات أعضاء هيئة التدريس مفقودة');
    }

    // التحقق من تطابق مساقات التخصصات
    if (siteData.specialties && siteData.courses) {
        Object.values(siteData.specialties).forEach(specialty => {
            if (specialty.courses) {
                specialty.courses.forEach(courseId => {
                    if (!siteData.courses[courseId]) {
                        issues.push(`المساق ${courseId} مفقود في بيانات المساقات`);
                    }
                });
            }
        });
    }

    if (issues.length > 0) {
        console.warn('⚠️ مشاكل في البيانات:', issues);
        return false;
    }

    console.log('✅ البيانات صحيحة ومتكاملة');
    return true;
}

// دالة للحصول على إحصائيات البيانات
function getDataStatistics() {
    if (!siteData) return null;

    return {
        specialties: Object.keys(siteData.specialties || {}).length,
        courses: Object.keys(siteData.courses || {}).length,
        faculty: Object.keys(siteData.faculty || {}).length,
        cybersecurityCourses: siteData.specialties?.cybersecurity?.courses?.length || 0,
        aiCourses: siteData.specialties?.ai?.courses?.length || 0
    };
}

// دالة مساعدة لإنشاء عنصر HTML
function createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

// دالة مساعدة لإضافة مستمع حدث بأمان
function safeAddEventListener(element, event, handler) {
    if (element && typeof handler === 'function') {
        element.addEventListener(event, handler);
        return true;
    }
    return false;
}
