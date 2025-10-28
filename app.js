// ملف JavaScript لإدارة المحتوى من JSON

// تحميل البيانات من JSON
let siteData = null;

// تحميل البيانات عند بدء التشغيل
async function loadData() {
    try {
        const response = await fetch('data.json');
        siteData = await response.json();
        console.log('✅ تم تحميل البيانات بنجاح');
        return true;
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        return false;
    }
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

// دالة عرض تفاصيل عضو هيئة التدريس (محدثة لاستخدام JSON)
function showFacultyDetails(facultyId) {
    const modal = document.getElementById('facultyModal');
    const content = document.getElementById('facultyModalContent');
    
    // منع التمرير في الخلفية
    document.body.classList.add('modal-open');
    
    // التحقق من تحميل البيانات
    if (!siteData || !siteData.faculty || !siteData.faculty[facultyId]) {
        content.innerHTML = '<p class="text-center text-red-600">عذراً، لا يمكن تحميل بيانات عضو هيئة التدريس</p>';
        modal.classList.remove('hidden');
        return;
    }
    
    const faculty = siteData.faculty[facultyId];
    
    content.innerHTML = `
        <div class="text-center mb-6">
            <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${faculty.gradient} p-2 mb-4">
                <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <i class="fas fa-user text-5xl text-gray-600"></i>
                </div>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${faculty.name}</h2>
            <p class="text-lg text-blue-600 font-medium">${faculty.position}</p>
        </div>
        
        <div class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-xl">
                <h3 class="font-bold text-gray-800 mb-2 flex items-center">
                    <i class="fas fa-graduation-cap text-blue-600 ml-2"></i> التحصيل الأكاديمي
                </h3>
                <p class="text-gray-600">${faculty.education}</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-xl">
                    <h3 class="font-bold text-blue-800 mb-2 flex items-center">
                        <i class="fas fa-briefcase text-blue-600 ml-2"></i> سنوات الخبرة
                    </h3>
                    <p class="text-blue-700">${faculty.experience}</p>
                </div>
                <div class="bg-green-50 p-4 rounded-xl">
                    <h3 class="font-bold text-green-800 mb-2 flex items-center">
                        <i class="fas fa-envelope text-green-600 ml-2"></i> البريد الإلكتروني
                    </h3>
                    <p class="text-green-700">${faculty.email}</p>
                </div>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-xl">
                <h3 class="font-bold text-purple-800 mb-2 flex items-center">
                    <i class="fas fa-star text-purple-600 ml-2"></i> التخصص
                </h3>
                <p class="text-purple-700">${faculty.specialization}</p>
            </div>
            
            <div class="bg-yellow-50 p-4 rounded-xl">
                <h3 class="font-bold text-yellow-800 mb-3 flex items-center">
                    <i class="fas fa-trophy text-yellow-600 ml-2"></i> الإنجازات والتميز
                </h3>
                <ul class="space-y-2">
                    ${faculty.achievements.map(achievement => `
                        <li class="text-yellow-700 flex items-start">
                            <i class="fas fa-medal text-yellow-600 ml-2 mt-1 text-sm"></i>
                            <span>${achievement}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="bg-indigo-50 p-4 rounded-xl">
                <h3 class="font-bold text-indigo-800 mb-3 flex items-center">
                    <i class="fas fa-chalkboard-teacher text-indigo-600 ml-2"></i> المساقات التي يدرسها
                </h3>
                <ul class="space-y-2">
                    ${faculty.courses.map(course => `
                        <li class="text-indigo-700 flex items-center">
                            <i class="fas fa-book text-indigo-600 ml-2"></i>
                            <span>${course}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-xl">
                <h3 class="font-bold text-gray-800 mb-2 flex items-center">
                    <i class="fas fa-map-marker-alt text-gray-600 ml-2"></i> مكتب الأستاذ
                </h3>
                <p class="text-gray-600">${faculty.office}</p>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// تحميل البيانات عند بدء التشغيل
loadData();
