class ARTFApp {
    constructor() {
        this.sections = [];
        this.equipment = [];
        this.files = [];
        this.socket = null;
        this.currentSection = 'dashboard';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupWebSocket();
        await this.loadInitialData();
        this.showSection('dashboard');
        
        // Show welcome notification
        this.showNotification('Système ARTF chargé avec succès', 'success');
    }

    setupWebSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            this.updateConnectionStatus('connected', 'Connecté');
            this.showNotification('Connexion en temps réel établie', 'success');
        });

        this.socket.on('disconnect', () => {
            this.updateConnectionStatus('disconnected', 'Déconnecté');
            this.showNotification('Connexion perdue - Mode hors ligne', 'warning');
        });

        this.socket.on('equipment_added', (equipment) => {
            this.showNotification(`Équipement ajouté: ${equipment.brand} ${equipment.model}`, 'success');
            this.loadEquipment();
        });

        this.socket.on('equipment_updated', (equipment) => {
            this.showNotification(`Équipement modifié: ${equipment.brand} ${equipment.model}`, 'success');
            this.loadEquipment();
        });

        this.socket.on('equipment_deleted', (data) => {
            this.showNotification('Équipement supprimé', 'success');
            this.loadEquipment();
        });
    }

    updateConnectionStatus(status, message) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.innerHTML = `<i class="fas fa-circle"></i><span>${message}</span>`;
            statusElement.className = `connection-status ${status}`;
        }
    }

    async loadInitialData() {
        await this.loadEquipment();
        await this.loadDocumentation();
        this.updateDashboardStats();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        // Equipment form
        const equipmentForm = document.getElementById('equipment-form');
        if (equipmentForm) {
            equipmentForm.addEventListener('submit', (e) => this.handleEquipmentSubmit(e));
        }

        // File upload form
        const fileUploadForm = document.getElementById('file-upload-form');
        if (fileUploadForm) {
            fileUploadForm.addEventListener('submit', (e) => this.handleFileUpload(e));
        }

        // Chat functionality
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Quick suggestions
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                document.getElementById('chat-input').value = question;
                this.sendMessage();
            });
        });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Filters
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', () => this.filterEquipment());
        });

        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('onclick');
                if (action) {
                    eval(action);
                }
            });
        });

        // Modal
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('edit-modal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Clear chat
        const clearChatBtn = document.getElementById('clear-chat');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => this.clearChat());
        }

        // Copy protection
        this.setupCopyProtection();
    }

    setupCopyProtection() {
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            this.showCopyWarning();
        });

        document.addEventListener('paste', (e) => {
            e.preventDefault();
            this.showCopyWarning();
        });

        document.addEventListener('cut', (e) => {
            e.preventDefault();
            this.showCopyWarning();
        });

        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    showCopyWarning() {
        this.showNotification('La copie de contenu est désactivée pour ce document technique.', 'warning');
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active nav item
        const navItem = document.querySelector(`[href="#${sectionId}"]`).parentElement;
        if (navItem) {
            navItem.classList.add('active');
        }

        // Update page title
        this.updatePageTitle(sectionId);

        this.currentSection = sectionId;
    }

    updatePageTitle(sectionId) {
        const titles = {
            'dashboard': 'Tableau de Bord',
            'documentation': 'Documentation Technique',
            'equipment': 'Gestion des Équipements',
            'assistant': 'Assistant Technique IA',
            'reports': 'Rapports & Exportations'
        };

        const titleElement = document.getElementById('page-title');
        const subtitleElement = document.getElementById('page-subtitle');

        if (titleElement) titleElement.textContent = titles[sectionId] || 'ARTF Building';
        if (subtitleElement) {
            subtitleElement.textContent = this.getSectionSubtitle(sectionId);
        }
    }

    getSectionSubtitle(sectionId) {
        const subtitles = {
            'dashboard': 'Vue d\'ensemble du système de gestion du bâtiment',
            'documentation': 'Documentation complète du projet de bâtiment intelligent ARTF',
            'equipment': 'Gérez l\'inventaire complet des équipements du bâtiment',
            'assistant': 'Obtenez des réponses instantanées sur le projet ARTF',
            'reports': 'Générez des rapports détaillés et exportez vos données'
        };
        return subtitles[sectionId] || '';
    }

    switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Activate corresponding button
        const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        // Load data for specific tabs
        if (tabId === 'equipment-files') {
            this.loadFiles();
        }
    }

    async loadEquipment() {
        this.showLoading(true);
        try {
            const floorFilter = document.getElementById('floor-filter')?.value || '';
            const typeFilter = document.getElementById('type-filter')?.value || '';
            const statusFilter = document.getElementById('status-filter')?.value || '';
            
            let url = '/api/equipment/list?';
            const params = [];
            
            if (floorFilter) params.push(`floor=${floorFilter}`);
            if (typeFilter) params.push(`type=${typeFilter}`);
            if (statusFilter) params.push(`status=${statusFilter}`);
            
            const response = await fetch(url + params.join('&'));
            this.equipment = await response.json();
            this.renderEquipment();
            this.updateFilters();
            this.updateDashboardStats();
            this.updateEquipmentCount();
        } catch (error) {
            console.error('Error loading equipment:', error);
            this.showNotification('Erreur lors du chargement des équipements', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderEquipment() {
        const tbody = document.getElementById('equipment-tbody');
        if (!tbody) return;

        if (this.equipment.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <div style="padding: 3rem; color: var(--secondary);">
                            <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <p>Aucun équipement trouvé</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.equipment.map(item => `
            <tr>
                <td>
                    <div class="equipment-type">
                        <i class="fas fa-${this.getEquipmentIcon(item.type)}"></i>
                        ${item.type}
                    </div>
                </td>
                <td>
                    <strong>${item.brand}</strong><br>
                    <small>${item.model}</small>
                    ${item.serial_number ? `<br><small class="text-muted">SN: ${item.serial_number}</small>` : ''}
                </td>
                <td>
                    <span class="floor-badge">Étage ${item.floor}</span>
                </td>
                <td>${item.room}</td>
                <td>
                    <div class="power-display">
                        <i class="fas fa-bolt"></i>
                        ${item.power_consumption}W
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${item.status.toLowerCase()}">
                        ${this.getStatusText(item.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn-small edit" onclick="app.editEquipment('${item.id}')" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn-small files" onclick="app.viewFiles('${item.id}')" title="Fichiers">
                            <i class="fas fa-paperclip"></i>
                        </button>
                        <button class="action-btn-small delete" onclick="app.deleteEquipment('${item.id}')" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getEquipmentIcon(type) {
        const icons = {
            'Serveur': 'server',
            'Switch': 'network-wired',
            'UPS': 'battery-half',
            'PDU': 'plug',
            'CCTV': 'video',
            'Climate': 'snowflake',
            'Capteur': 'microchip',
            'Automate': 'cog'
        };
        return icons[type] || 'hdd';
    }

    getStatusText(status) {
        const statusMap = {
            'Planned': 'Planifié',
            'Installed': 'Installé',
            'Operational': 'Opérationnel',
            'Maintenance': 'Maintenance'
        };
        return statusMap[status] || status;
    }

    updateFilters() {
        const floorFilter = document.getElementById('floor-filter');
        const typeFilter = document.getElementById('type-filter');
        const exportFloor = document.getElementById('export-floor');
        const exportType = document.getElementById('export-type');
        
        if (!this.equipment.length) return;

        // Get unique floors and types
        const floors = [...new Set(this.equipment.map(eq => eq.floor))].sort((a, b) => a - b);
        const types = [...new Set(this.equipment.map(eq => eq.type))].sort();
        
        // Update filters
        [floorFilter, exportFloor].forEach(select => {
            if (select) {
                select.innerHTML = '<option value="">Tous les étages</option>';
                floors.forEach(floor => {
                    select.innerHTML += `<option value="${floor}">Étage ${floor}</option>`;
                });
            }
        });
        
        [typeFilter, exportType].forEach(select => {
            if (select) {
                select.innerHTML = '<option value="">Tous les types</option>';
                types.forEach(type => {
                    select.innerHTML += `<option value="${type}">${type}</option>`;
                });
            }
        });
    }

    updateDashboardStats() {
        const totalEquipment = this.equipment.length;
        const totalPower = this.equipment.reduce((sum, item) => sum + (item.power_consumption || 0), 0);

        // Update stats cards
        const totalElement = document.getElementById('total-equipment');
        const powerElement = document.getElementById('total-power');

        if (totalElement) totalElement.textContent = totalEquipment;
        if (powerElement) powerElement.textContent = `${totalPower} W`;

        // Update equipment count in nav
        this.updateEquipmentCount();

        // Update recent equipment list
        this.updateRecentEquipment();

        // Update floor distribution
        this.updateFloorDistribution();
    }

    updateFloorDistribution() {
        const distributionContainer = document.getElementById('floor-distribution');
        if (!distributionContainer) return;

        // Group equipment by floor
        const floorData = {};
        this.equipment.forEach(item => {
            if (!floorData[item.floor]) {
                floorData[item.floor] = 0;
            }
            floorData[item.floor]++;
        });

        // Find max count for scaling
        const maxCount = Math.max(...Object.values(floorData), 1);

        // Sort floors
        const sortedFloors = Object.keys(floorData).sort((a, b) => parseInt(a) - parseInt(b));

        // Generate HTML
        const floorHTML = sortedFloors.map(floor => {
            const count = floorData[floor];
            const percentage = (count / maxCount) * 100;
            const floorLabel = floor === '-1' ? 'Sous-sol' : (floor === '0' ? 'RDC' : `Étage ${floor}`);

            return `
                <div class="floor-item">
                    <div class="floor-label">${floorLabel}</div>
                    <div class="floor-bar-container">
                        <div class="floor-bar" style="width: ${percentage}%">
                            ${count > 0 ? count : ''}
                        </div>
                    </div>
                    <div class="floor-count">${count}</div>
                </div>
            `;
        }).join('');

        distributionContainer.innerHTML = floorHTML || '<p class="text-muted">Aucune donnée disponible</p>';
    }

    updateEquipmentCount() {
        const countElement = document.getElementById('equipment-count');
        if (countElement) {
            countElement.textContent = this.equipment.length;
        }
    }

    updateRecentEquipment() {
        const recentList = document.getElementById('recent-equipment-list');
        if (!recentList) return;

        const recentEquipment = this.equipment.slice(0, 5);
        
        if (recentEquipment.length === 0) {
            recentList.innerHTML = '<p class="text-muted">Aucun équipement récent</p>';
            return;
        }

        recentList.innerHTML = recentEquipment.map(item => `
            <div class="recent-equipment-item">
                <div class="equipment-icon">
                    <i class="fas fa-${this.getEquipmentIcon(item.type)}"></i>
                </div>
                <div class="equipment-info">
                    <strong>${item.brand} ${item.model}</strong>
                    <div class="equipment-meta">
                        <span>Étage ${item.floor}</span>
                        <span>•</span>
                        <span>${item.room}</span>
                    </div>
                </div>
                <div class="equipment-status">
                    <span class="status-badge status-${item.status.toLowerCase()}">
                        ${this.getStatusText(item.status)}
                    </span>
                </div>
            </div>
        `).join('');
    }

    async handleEquipmentSubmit(e) {
        e.preventDefault();
        this.showLoading(true);
        
        const formData = new FormData(e.target);
        const equipment = {
            type: formData.get('type'),
            brand: formData.get('brand'),
            model: formData.get('model'),
            serialNumber: formData.get('serialNumber'),
            floor: parseInt(formData.get('floor')),
            room: formData.get('room'),
            powerConsumption: parseInt(formData.get('powerConsumption')),
            voltage: parseInt(formData.get('voltage')),
            connectivity: formData.get('connectivity'),
            protocols: formData.getAll('protocols'),
            installationDate: formData.get('installationDate'),
            warrantyUntil: formData.get('warrantyUntil'),
            status: formData.get('status') || 'Planned'
        };

        try {
            const response = await fetch('/api/equipment/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(equipment)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Équipement ajouté avec succès!', 'success');
                e.target.reset();
                await this.loadEquipment();
                await this.loadEquipmentForFiles();
                this.switchTab('equipment-list');
            } else {
                this.showNotification('Erreur lors de l\'ajout: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error adding equipment:', error);
            this.showNotification('Erreur lors de l\'ajout de l\'équipement', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async editEquipment(id) {
        // Implementation for editing equipment
        this.showNotification('Fonctionnalité d\'édition à venir', 'info');
    }

    async deleteEquipment(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est irréversible.')) {
            this.showLoading(true);
            try {
                const response = await fetch(`/api/equipment/delete/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();
                
                if (result.success) {
                    this.showNotification('Équipement supprimé avec succès', 'success');
                    await this.loadEquipment();
                    await this.loadEquipmentForFiles();
                } else {
                    this.showNotification('Erreur lors de la suppression: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Error deleting equipment:', error);
                this.showNotification('Erreur lors de la suppression', 'error');
            } finally {
                this.showLoading(false);
            }
        }
    }

    async loadEquipmentForFiles() {
        try {
            const response = await fetch('/api/equipment/list');
            const equipment = await response.json();
            
            const select = document.getElementById('file-equipment');
            if (select) {
                select.innerHTML = '<option value="">Sélectionnez un équipement</option>';
                
                equipment.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = `${item.type} - ${item.brand} ${item.model} (Étage ${item.floor})`;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading equipment for files:', error);
        }
    }

    async handleFileUpload(e) {
        e.preventDefault();
        this.showLoading(true);
        
        const formData = new FormData(e.target);
        const equipmentId = formData.get('equipmentId');

        try {
            const response = await fetch(`/api/upload/equipment/${equipmentId}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Fichier uploadé avec succès!', 'success');
                e.target.reset();
                await this.loadFiles(equipmentId);
            } else {
                this.showNotification('Erreur lors de l\'upload: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            this.showNotification('Erreur lors de l\'upload du fichier', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadFiles(equipmentId = null) {
        if (!equipmentId) {
            equipmentId = document.getElementById('file-equipment')?.value;
        }
        
        if (!equipmentId) {
            const filesGrid = document.getElementById('files-grid');
            if (filesGrid) {
                filesGrid.innerHTML = '<p class="text-muted">Sélectionnez un équipement pour voir ses fichiers</p>';
            }
            return;
        }

        try {
            const response = await fetch(`/api/upload/equipment/${equipmentId}`);
            this.files = await response.json();
            this.renderFiles();
        } catch (error) {
            console.error('Error loading files:', error);
        }
    }

    renderFiles() {
        const filesGrid = document.getElementById('files-grid');
        if (!filesGrid) return;

        if (this.files.length === 0) {
            filesGrid.innerHTML = '<p class="text-muted">Aucun fichier associé à cet équipement</p>';
            return;
        }

        filesGrid.innerHTML = this.files.map(file => `
            <div class="file-card">
                <div class="file-icon">
                    <i class="fas fa-${this.getFileIcon(file.mime_type)}"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.original_name}</div>
                    <div class="file-meta">
                        ${this.formatFileSize(file.file_size)} • 
                        ${new Date(file.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    ${file.description ? `<div class="file-description">${file.description}</div>` : ''}
                </div>
                <div class="file-actions">
                    <button class="btn btn-sm btn-primary" onclick="app.downloadFile('${file.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteFile('${file.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getFileIcon(mimeType) {
        if (mimeType?.includes('image')) return 'file-image';
        if (mimeType?.includes('pdf')) return 'file-pdf';
        if (mimeType?.includes('word')) return 'file-word';
        if (mimeType?.includes('excel')) return 'file-excel';
        return 'file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async downloadFile(fileId) {
        window.open(`/api/upload/download/${fileId}`, '_blank');
    }

    async deleteFile(fileId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
            try {
                const response = await fetch(`/api/upload/delete/${fileId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();
                
                if (result.success) {
                    this.showNotification('Fichier supprimé avec succès', 'success');
                    await this.loadFiles();
                } else {
                    this.showNotification('Erreur lors de la suppression: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Error deleting file:', error);
                this.showNotification('Erreur lors de la suppression du fichier', 'error');
            }
        }
    }

    viewFiles(equipmentId) {
        this.switchSection('equipment');
        this.switchTab('equipment-files');
        document.getElementById('file-equipment').value = equipmentId;
        this.loadFiles(equipmentId);
    }

    async loadDocumentation() {
        try {
            const response = await fetch('/api/document/sections');
            this.sections = await response.json();
            this.setupDocumentationNav();
        } catch (error) {
            console.error('Error loading documentation:', error);
        }
    }

    setupDocumentationNav() {
        const docsNav = document.querySelector('.docs-nav');
        if (!docsNav) return;

        docsNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const sectionId = e.target.getAttribute('data-section');
                this.loadDocumentationSection(sectionId);
                
                // Update active state
                document.querySelectorAll('.docs-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });

        // Load first section by default
        if (this.sections.length > 0) {
            this.loadDocumentationSection(this.sections[0].id);
        }
    }

    async loadDocumentationSection(sectionId) {
        try {
            const response = await fetch(`/api/document/section/${sectionId}`);
            const section = await response.json();
            this.renderDocumentationSection(section);
        } catch (error) {
            console.error('Error loading documentation section:', error);
        }
    }

    renderDocumentationSection(section) {
        const article = document.getElementById('docs-article');
        if (!article) return;

        let subsectionsHTML = '';
        if (section.subsections) {
            subsectionsHTML = section.subsections.map(sub => `
                <div class="subsection">
                    <h3>${sub.title}</h3>
                    <p>${sub.content}</p>
                </div>
            `).join('');
        }

        article.innerHTML = `
            <article class="doc-article">
                <h1>${section.title}</h1>
                <div class="doc-meta">
                    <span class="doc-date">Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}</span>
                </div>
                <div class="doc-content">
                    <p>${section.content}</p>
                    ${subsectionsHTML}
                </div>
            </article>
        `;
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        input.value = '';

        this.showLoading(true);
        try {
            const response = await fetch('/api/chat/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: message })
            });

            const result = await response.json();
            this.addMessage(result.answer, 'bot');
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('Désolé, une erreur s\'est produite. Veuillez réessayer.', 'bot');
        } finally {
            this.showLoading(false);
        }
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${content}</div>
                <div class="message-time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-text">
                            Bonjour ! Je suis l'assistant technique du projet ARTF. Je peux vous aider avec des informations sur le NOC, Data Center, CTI, Smart Building, et l'architecture réseau. Comment puis-je vous assister aujourd'hui ?
                        </div>
                        <div class="message-time">Maintenant</div>
                    </div>
                </div>
            `;
        }
    }

    async exportToExcel() {
        const floor = document.getElementById('export-floor')?.value || '';
        const type = document.getElementById('export-type')?.value || '';
        const status = document.getElementById('export-status')?.value || '';
        
        let url = '/api/export/equipment/excel?';
        const params = [];
        
        if (floor) params.push(`floor=${floor}`);
        if (type) params.push(`type=${type}`);
        if (status) params.push(`status=${status}`);
        
        this.showNotification('Génération du fichier Excel en cours...', 'info');
        window.location.href = url + params.join('&');
    }

    async exportToJSON() {
        const floor = document.getElementById('export-floor')?.value || '';
        const type = document.getElementById('export-type')?.value || '';
        const status = document.getElementById('export-status')?.value || '';
        
        let url = '/api/export/equipment/json?';
        const params = [];
        
        if (floor) params.push(`floor=${floor}`);
        if (type) params.push(`type=${type}`);
        if (status) params.push(`status=${status}`);
        
        this.showNotification('Génération du fichier JSON en cours...', 'info');
        window.location.href = url + params.join('&');
    }

    refreshEquipment() {
        this.loadEquipment();
        this.showNotification('Liste des équipements actualisée', 'success');
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = show ? 'block' : 'none';
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    switchSection(section) {
        this.showSection(section);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ARTFApp();
});

// Global functions for onclick handlers
function switchSection(section) {
    if (window.app) {
        window.app.switchSection(section);
    }
}

function exportToExcel() {
    if (window.app) {
        window.app.exportToExcel();
    }
}

function exportToJSON() {
    if (window.app) {
        window.app.exportToJSON();
    }
}