const image = document.getElementById('image');
        const angleInfo = document.getElementById('angle-info');
        const userInput = document.getElementById('user-input');
        const answerBox = document.querySelector('.answer');
        const but1 = document.querySelector('.But1');
        const but2 = document.querySelector('.But2');
        const angleInput = document.getElementById('angle-input');
        let isDragging = false;
        let startAngle = 0;
        let currentAngle = 0;
        let startX, startY;

        const snapAngle = 360 / 26;

        function resizeTextToFit() {
            const elements = document.querySelectorAll('.write, .answer, button');
            elements.forEach(el => {
                let fontSize = 16; // Initial font size in pixels
                el.style.fontSize = `${fontSize}px`;

                while (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
                    fontSize--;
                    el.style.fontSize = `${fontSize}px`;
                }
            });
        }

window.addEventListener('resize', resizeTextToFit);
window.addEventListener('load', resizeTextToFit);

        function getAngle(x, y, centerX, centerY) {
            return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
        }
        image.addEventListener('touchstart', (e) => {
            isDragging = true;
            const rect = image.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
        
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startAngle = getAngle(startX, startY, centerX, centerY) - currentAngle;
        
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const rect = image.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
        
                const newAngle = getAngle(e.touches[0].clientX, e.touches[0].clientY, centerX, centerY);
                currentAngle = newAngle - startAngle;
        
                image.style.transform = `rotate(${currentAngle}deg)`;
            }
        });
        
        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                const snappedAngle = Math.round(currentAngle / snapAngle) * snapAngle;
                image.style.transform = `rotate(${snappedAngle}deg)`;
                currentAngle = snappedAngle;
        
                // Calculate the number of angles changed
                const numberOfAnglesChanged = snappedAngle / snapAngle;
                if (numberOfAnglesChanged < 0) {
                    angleInput.value = Math.round(numberOfAnglesChanged + 26);
                } else {
                    angleInput.value = Math.round(numberOfAnglesChanged);
                }
            }
        });
        
        image.addEventListener('pointerdown', (e) => {
            isDragging = true;
            const rect = image.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            startX = e.clientX;
            startY = e.clientY;
            startAngle = getAngle(startX, startY, centerX, centerY) - currentAngle;

            e.preventDefault(); // Prevent default behavior like text selection
        });

        image.addEventListener('pointermove', (e) => {
            if (isDragging) {
                const rect = image.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
        
                const newAngle = getAngle(e.clientX, e.clientY, centerX, centerY);
                currentAngle = newAngle - startAngle;
        
                image.style.transform = `rotate(${currentAngle}deg)`;
                // Adjust this multiplier to make the rotation more or less sensitive
                currentAngle = Math.round(currentAngle / 0.5) * 0.5; // Allows smoother dragging on mobile.
            }
        });
        

        document.addEventListener('pointerup', () => {
            if (isDragging) {
                isDragging = false;
                const snappedAngle = Math.round(currentAngle / snapAngle) * snapAngle;
                image.style.transform = `rotate(${snappedAngle}deg)`;
                currentAngle = snappedAngle;

                // Calculate the number of angles changed
                const numberOfAnglesChanged = snappedAngle / snapAngle;
                angleInfo.textContent = `Number of angles changed: `;
                if(numberOfAnglesChanged < 0){
                    angleInput.value = Math.round(numberOfAnglesChanged + 26);
                }
                else{
                    angleInput.value = Math.round(numberOfAnglesChanged);
                }
            }
        });

        

        angleInput.addEventListener('input', (e) => {
            let inputAngle = parseInt(e.target.value, 10);

            if (inputAngle > 25) {
                inputAngle = 0;
            } else if (inputAngle < 0) {
                inputAngle = 25;
            }

            angleInput.value = inputAngle;
            
            const rotationAngle = inputAngle * snapAngle; // Calculate the rotation based on input
            image.style.transform = `rotate(${rotationAngle}deg)`;

            // Update the displayed number of angles changed as an integer
            angleInfo.textContent = `Number of angles changed: `;
        });

        
        function cipherText(shift) {
            const inputText = userInput.value.toUpperCase();
            let cipheredText = '';

            shift = shift % 26;
            if (shift < 0) {
                shift = 26 + shift;
            }

            for (let i = 0; i < inputText.length; i++) {
                let charCode = inputText.charCodeAt(i);

                if (charCode >= 65 && charCode <= 90) { // A-Z
                    let shiftedCode = ((charCode - 65 + shift) % 26) + 65;
                    cipheredText += String.fromCharCode(shiftedCode);
                } else {
                    cipheredText += inputText[i];
                }
            }

            answerBox.textContent = cipheredText;
        }

        // Event listeners for the buttons
        but1.addEventListener('click', () => {
            const numberOfAnglesChanged = parseInt(angleInput.value);
            cipherText(numberOfAnglesChanged);  // Cipher text
        });

        but2.addEventListener('click', () => {
            const numberOfAnglesChanged = parseInt(angleInput.value);
            cipherText(-numberOfAnglesChanged);  // Decipher text (shift left)
        });