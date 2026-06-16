document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('result');
    const buttonsContainer = document.querySelector('.buttons');
    const modal = document.getElementById('subscription-modal');
    const closeModalBtn = document.querySelector('[data-action="close-modal"]');
    const freeTrialBtn = document.getElementById('free-trial-btn');
    const planSelectionView = document.getElementById('plan-selection-view');
    const paymentView = document.getElementById('payment-view');
    const subscribeButtons = document.querySelectorAll('.btn-subscribe');
    const backToPlansBtn = document.querySelector('.back-to-plans');
    const paymentForm = document.getElementById('payment-form');
    const selectedPlanNameEl = document.getElementById('selected-plan-name');
    const selectedPlanPriceEl = document.getElementById('selected-plan-price');
    const paymentMethodTabs = document.querySelectorAll('.payment-method-tab');
    const paymentPanels = document.querySelectorAll('.payment-panel');
    const plans = document.querySelectorAll('.plan');

    let currentExpression = '';

    // Menggunakan event delegation untuk menangani semua klik tombol
    buttonsContainer.addEventListener('click', (event) => {
        const target = event.target;

        // Pastikan yang diklik adalah tombol
        if (!target.matches('button')) {
            return;
        }

        const value = target.dataset.value;
        const action = target.dataset.action;

        if (value) {
            // Menambahkan nilai tombol ke ekspresi
            currentExpression += value;
            updateDisplay();
        } else if (action) {
            // Menjalankan aksi khusus (clear, backspace, calculate)
            handleAction(action);
        }
    });

    /**
     * Menangani aksi khusus dari tombol seperti C, ⌫, dan =
     * @param {string} action - Aksi yang akan dijalankan
     */
    function handleAction(action) {
        switch (action) {
            case 'clear':
                currentExpression = '';
                updateDisplay();
                break;
            case 'backspace':
                currentExpression = currentExpression.slice(0, -1);
                updateDisplay();
                break;
            case 'calculate':
                showSubscriptionModal();
                break;
        }
    }

    /**
     * Menampilkan modal langganan jika ada ekspresi yang akan dihitung.
     */
    function showSubscriptionModal() {
        if (currentExpression === '' || display.value === 'Error') {
            return;
        }
        modal.classList.add('show');
    }

    /**
     * Menyembunyikan modal langganan.
     */
    function hideSubscriptionModal() {
        modal.classList.remove('show');

        // Reset tampilan modal setelah animasi fade-out selesai
        // agar saat dibuka lagi, kembali ke kondisi awal.
        setTimeout(() => {
            // Kembali ke tampilan pemilihan paket
            paymentView.classList.add('hidden');
            planSelectionView.classList.remove('hidden');
            // Hapus seleksi dari semua paket
            plans.forEach(p => p.classList.remove('selected'));
        }, 300); // Durasi harus cocok dengan transisi CSS (0.3s)
    }

    /**
     * Menjalankan perhitungan matematika yang sebenarnya.
     */
    function performCalculation() {
        // Sesuai permintaan, setelah free trial, tampilkan "Hello World!"
        // dan reset ekspresi saat ini.
        currentExpression = ''; // Reset ekspresi setelah "menghitung"
        updateDisplay('Hello World!');
    }

    // Event listener untuk pemilihan paket
    plans.forEach(plan => {
        plan.addEventListener('click', () => {
            // Hapus kelas 'selected' dari semua paket lain
            plans.forEach(p => p.classList.remove('selected'));
            // Tambahkan kelas 'selected' ke paket yang diklik
            plan.classList.add('selected');
        });
    });

    // Event listener untuk semua tombol "Berlangganan"
    subscribeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const planElement = button.closest('.plan');
            const planName = planElement.querySelector('[data-plan-name]').dataset.planName;
            const planPrice = planElement.querySelector('[data-plan-price]').dataset.planPrice;

            // Perbarui info di tampilan pembayaran
            selectedPlanNameEl.textContent = planName;
            selectedPlanPriceEl.textContent = planPrice;

            // Ganti tampilan
            planSelectionView.classList.add('hidden');
            paymentView.classList.remove('hidden');
        });
    });

    // Event listener untuk tombol kembali ke pilihan paket
    backToPlansBtn.addEventListener('click', () => {
        paymentView.classList.add('hidden');
        planSelectionView.classList.remove('hidden');
    });

    // Event listener untuk form pembayaran
    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Mencegah form submit standar
        alert('Pembayaran berhasil! Selamat menikmati fitur premium.');
        hideSubscriptionModal();
        performCalculation(); // Tampilkan "Hello World!" setelah "pembayaran"
    });

    // Event listener untuk tab metode pembayaran
    paymentMethodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Hapus kelas 'active' dari semua tab dan panel
            paymentMethodTabs.forEach(t => t.classList.remove('active'));
            paymentPanels.forEach(p => p.classList.remove('active'));

            // Tambahkan kelas 'active' ke tab yang diklik
            tab.classList.add('active');

            // Tampilkan panel yang sesuai
            const targetPanelId = tab.dataset.target;
            document.getElementById(targetPanelId).classList.add('active');
        });
    });

    // Event listener untuk tombol free trial
    freeTrialBtn.addEventListener('click', () => {
        hideSubscriptionModal();
        performCalculation();
    });

    // Event listener untuk tombol tutup modal
    closeModalBtn.addEventListener('click', hideSubscriptionModal);

    // Event listener untuk menutup modal saat mengklik di luar kontennya (overlay)
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideSubscriptionModal();
        }
    });

    /**
     * Memperbarui tampilan kalkulator
     * @param {string} [text=null] - Teks opsional untuk ditampilkan (misalnya, 'Error')
     */
    function updateDisplay(text = null) {
        if (text !== null) {
            display.value = text;
        } else {
            display.value = currentExpression || '0';
        }
    }
});
