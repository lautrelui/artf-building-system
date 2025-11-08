const documentSections = {
    "introduction": {
        id: "introduction",
        title: "Introduction Institutionnelle",
        content: `Ce rapport technique a été élaboré à la demande de l'Autorité de Régulation des Transferts de Fonds du Congo (ARTF) afin de définir les standards d'aménagement, d'interconnexion et de supervision de son nouveau bâtiment administratif. Il présente les exigences d'infrastructure, de connectivité, d'énergie et de sécurité nécessaires à l'exploitation du NOC, du Data Center, et du centre de contrôle du Smart Building.`,
        subsections: [
            {
                title: "Contexte Général",
                content: "Le bâtiment de l'ARTF est une construction de neuf étages. Le NOC (Network Operations Center) et le Data Center seront aménagés au 3e étage. Il est également prévu d'y installer un centre de gestion sécurisée dédié à la surveillance et au management intelligent de l'ensemble du bâtiment."
            },
            {
                title: "Objet du Rapport",
                content: "Formuler les spécifications techniques nécessaires à la préparation de l'infrastructure technologique et logistique du site autour de trois axes principaux: aménagement du NOC et Data Center, rapatriement du CTI, et mise en place d'une logistique centralisée."
            }
        ]
    },
    "noc-datacenter": {
        id: "noc-datacenter",
        title: "Aménagement du NOC et du Data Center (3e étage)",
        content: "Création au 3e étage de deux zones critiques et distinctes avec niveau de résilience visé équivalent Tier III (Uptime Institute – redondance N+1, maintenance sans arrêt).",
        subsections: [
            {
                title: "Zoning & Contrôle d'Accès",
                content: "Vestibule/Mantrap avec sas à deux portes interverrouillées, lecture badge + MFA (badge + PIN/biométrie), poste agent de contrôle avec système FBB."
            },
            {
                title: "Salle Serveurs (Data Center)",
                content: "Racks 42U avec PDU A/B mesurés, architecture de refroidissement ASHRAE TC9.9 (N+I minimum, confinement allée froide), détection incendie VESDA + extinction propre Novec 1230/FM-200."
            },
            {
                title: "Salle d'Exploitation (NOC)",
                content: "Mur d'écrans ≥ 3×2 redondant, postes opérateurs 24/7 avec mobilier 'sit-stand', conception ISO 11064, procédures SOP/MOP/EOP."
            }
        ]
    },
    "cti-repatriement": {
        id: "cti-repatriement",
        title: "Rapatriement du CTI",
        content: "Transfert progressif des fonctions critiques vers le Data Center ARTF et transformation du CTI en site secondaire actif (Hot Standby) assurant la continuité de service.",
        subsections: [
            {
                title: "Architecture et Interconnexion",
                content: "Deux fournisseurs Internet indépendants (FAI A et B) avec VPN TLS 1.3 sécurisé reliant les deux sites, authentification mutuelle par certificats X.509."
            },
            {
                title: "Étapes de Migration",
                content: "Migration en 4 phases: préparation environnement ARTF, réplication et synchronisation, bascule progressive des services, stabilisation et requalification du CTI."
            },
            {
                title: "Sécurité et Supervision",
                content: "VPN TLS 1.3 avec chiffrement AES-256/GCM, authentification mutuelle (mTLS), segmentation VLAN/VRF, politique Zero Trust inter-sites."
            }
        ]
    },
    "smart-building": {
        id: "smart-building",
        title: "Gestion Intelligente du Bâtiment",
        content: "Infrastructure intelligente permettant la supervision, la commande et la maintenance proactive de l'ensemble des systèmes techniques du bâtiment.",
        subsections: [
            {
                title: "Centre de Contrôle Centralisé (CCC)",
                content: "Cœur opérationnel avec mur d'écrans multi-fenêtré, 5-6 postes opérateurs dédiés, relié au Data Center par backbone fibre optique Est/Ouest redondant."
            },
            {
                title: "Systèmes Supervisés",
                content: "Énergie et alimentation, climatisation et confort, sécurité et sûreté, infrastructure IT et réseaux, gestion environnementale et bâtiments annexes."
            },
            {
                title: "Protocoles Supportés",
                content: "BACnet/IP (climatisation, ventilation), Modbus/TCP (armoires électriques), KNX/IP (éclairage), MQTT/OPC-UA (IoT), ONVIF/RTSP (vidéosurveillance)."
            }
        ]
    },
    "connectivity": {
        id: "connectivity",
        title: "Architecture de Connectivité Externe",
        content: "Garantir la résilience et redondance des connexions réseau avec l'extérieur, sécurité cryptographique des échanges, et isolation fonctionnelle entre réseaux.",
        subsections: [
            {
                title: "Topologie Générale",
                content: "Trois réseaux principaux: Internet Public (double FAI), Réseau Gouvernemental Privé (MPLS), Réseau de Gestion Intelligente (interne isolé)."
            },
            {
                title: "Entrées Physiques et Redondance",
                content: "Deux chambres optiques indépendantes (entrée avant Sud et arrière Nord), double entrée fibre avec trajets physiquement distincts."
            },
            {
                title: "Connectivité des Assujettis",
                content: "Boîtiers OneBox connectés via tunnels VPN TLS 1.3 authentifiés et chiffrés, avec filtrage IP et contrôle d'identité (mTLS)."
            }
        ]
    },
    "backbone": {
        id: "backbone",
        title: "Backbone Optique Vertical & Roof POP",
        content: "Colonne vertébrale réseau du bâtiment assurant distribution et redondance des connexions fibre avec résilience de niveau Tier III.",
        subsections: [
            {
                title: "Topologie Générale",
                content: "Deux chemins optiques verticaux redondants (Est et Ouest) transportant fibres Internet, Réseau Gouvernemental, Smart Building, et fibre interne de secours."
            },
            {
                title: "Roof POP",
                content: "Point haut du bâtiment pour antennes communication (5G, Wi-Fi longue portée), modem satellite VSAT/Starlink, baie d'interconnexion optique protégée."
            },
            {
                title: "Accès Optique par Étage",
                content: "Salle technique dédiée à chaque étage avec Points d'Accès Optiques (PAO), conversion fibre/ethernet, distribution horizontale vers équipements."
            }
        ]
    },
    "energy": {
        id: "energy",
        title: "Énergie, Continuité & Efficacité",
        content: "Architecture énergétique assurant continuité d'alimentation totale (Tier III) avec bascule automatique multi-niveaux et supervision centralisée.",
        subsections: [
            {
                title: "Groupes Électrogènes",
                content: "Groupe principal G1 (≥ 250 kVA) et groupe secondaire G2 éco (60-80 kVA) pour alimentation secours avec gestion automatique via GTB."
            },
            {
                title: "Onduleurs (UPS)",
                content: "Double chaîne A/B avec UPS online double conversion, autonomie 30-60 min, batteries LiFePO₄, monitoring SNMPv3 intégré au FBB."
            },
            {
                title: "Énergie Solaire",
                content: "Panneaux photovoltaïques Roof POP (30-40 kWc) alimentant prioritairement le Data Center, avec suivi temps réel via FBB."
            }
        ]
    },
    "supervision": {
        id: "supervision",
        title: "Système de Contrôle et d'Alerte FBB",
        content: "Plateforme centrale de supervision, corrélation et alerte unifiant la surveillance IT et OT au sein d'une interface unique.",
        subsections: [
            {
                title: "Architecture Fonctionnelle",
                content: "Multi-couches: collecte (SNMPv3, API REST, MQTT), transport et traitement, corrélation et analyse, visualisation et reporting, automatisation et réaction."
            },
            {
                title: "Intégration Multi-Systèmes",
                content: "Bus d'intégration global compatible FinTraX, Smart Building, réseau/télécoms, énergie, sécurité/vidéo, et CTI/externe."
            },
            {
                title: "Résilience et Sécurité",
                content: "Architecture redondante active/active, réplication asynchrone vers CTI, authentification MFA + RBAC, journalisation complète des actions."
            }
        ]
    }
};

exports.getSections = () => {
    return Object.values(documentSections).map(section => ({
        id: section.id,
        title: section.title,
        content: section.content.substring(0, 150) + '...'
    }));
};

exports.getSection = (id) => {
    return documentSections[id];
};