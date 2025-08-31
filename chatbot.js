window.addEventListener('DOMContentLoaded', function() {
    var icon = document.getElementById('chatbotIcon');
    var container = document.getElementById('chatContainer');
    var messages = document.getElementById('chatbotMessages');
    var input = document.getElementById('chatbotInput');
    var send = document.getElementById('chatbotSend');
    var pageLinks = {
        cv: "formulaire-original.html",
        catalogue: "catalogue de CV.html",
        lettre: "formulaire-lettre.html",
        accueil: "index.html"
    };

    // Variables pour l'assistance interactive
        var formStep = null;
        var formData = {};
        // Ajout pour gestion étape par étape
        var formSteps = [
            "Étape 1 : Veuillez saisir vos informations personnelles (nom, prénom, téléphone, email).",
            "Étape 2 : Indiquez l'entreprise ou le poste ciblé.",
            "Étape 3 : Décrivez vos expériences et formations.",
            "Étape 4 : Listez vos compétences principales.",
            "Étape 5 : Vérifiez vos informations. Le tarif s'affichera et vous recevrez la facture."
        ];
        var currentStep = null;

    // Affichage/fermeture du chat
    icon.onclick = function() {
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    };

    // Ajout d'un message dans le chat
    function addMessage(text, fromUser) {
        var msg = document.createElement('div');
        msg.style.margin = '8px 0';
        msg.style.textAlign = fromUser ? 'right' : 'left';
        msg.innerHTML = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    // Réponse du bot enrichie
    function botReply(userText) {
        var t = userText.trim().toLowerCase();

        // Détection de la demande d'accompagnement étape par étape
        if ((t.includes("aide") && t.includes("étape")) || t.includes("guide-moi") || t.includes("accompagne-moi") || t.includes("étape par étape")) {
            currentStep = 0;
            return formSteps[0];
        }

        // Gestion du scénario étape par étape
        if (currentStep !== null) {
            // Passage à l'étape suivante sur mot clé
            if (t.includes("suivant") || t.includes("ok") || t.includes("fait") || t.includes("continue")) {
                currentStep++;
                if (currentStep < formSteps.length) {
                    return formSteps[currentStep];
                } else {
                    currentStep = null;
                    return "Bravo ! Vous avez terminé le formulaire. Vous recevrez la facture et les instructions de paiement.";
                }
            }
            // Si l'utilisateur donne une info, on avance aussi
            else if (t.length > 2) {
                currentStep++;
                if (currentStep < formSteps.length) {
                    return formSteps[currentStep];
                } else {
                    currentStep = null;
                    return "Bravo ! Vous avez terminé le formulaire. Vous recevrez la facture et les instructions de paiement.";
                }
            }
        }

        // Démarrage de l'assistance formulaire
        if ((t.includes('remplir') && t.includes('formulaire')) || (t.includes('aide') && t.includes('formulaire'))) {
            formStep = 'nom';
            return "D'accord, commençons ! Quel est votre nom ?";
        }

        // Séquence d'assistance formulaire
        if (formStep) {
            if (formStep === 'nom') {
                formData.nom = userText;
                formStep = 'prenom';
                return "Merci ! Quel est votre prénom ?";
            }
            if (formStep === 'prenom') {
                formData.prenom = userText;
                formStep = 'email';
                return "Merci ! Quelle est votre adresse e-mail ?";
            }
            if (formStep === 'email') {
                formData.email = userText;
                formStep = 'formation';
                return "Merci ! Quelle est votre formation principale ?";
            }
            if (formStep === 'formation') {
                formData.formation = userText;
                formStep = null;
                return "Merci ! Pour les expériences professionnelles et la photo, vous devrez les remplir vous-même dans le formulaire. Voulez-vous un conseil pour la rédaction ?";
            }
        }

        // Assistance lettre de motivation
        if (t.includes('lettre') && t.includes('motivation')) {
            formStep = 'poste';
            return "Pour la lettre de motivation, quel poste visez-vous ?";
        }
        if (formStep === 'poste') {
            formData.poste = userText;
            formStep = 'motivation';
            return "Merci ! Quelles sont vos motivations principales pour ce poste ?";
        }
        if (formStep === 'motivation') {
            formData.motivation = userText;
            formStep = null;
            return "Merci ! Pensez à mettre en avant vos compétences et à personnaliser votre lettre. Voulez-vous un exemple de phrase ?";
        }

        // Réponses enrichies
        if (t.includes('cv')) return 'Pour créer votre CV, <a href="'+pageLinks.cv+'" target="_blank">cliquez ici</a>.';
        if (t.includes('catalogue')) return 'Pour voir les modèles, <a href="'+pageLinks.catalogue+'" target="_blank">cliquez ici</a>.';
        if (t.includes('lettre')) return 'Pour rédiger une lettre de motivation, <a href="'+pageLinks.lettre+'" target="_blank">cliquez ici</a>.';
        if (t.includes('accueil')) return 'Pour revenir à l’accueil, <a href="'+pageLinks.accueil+'" target="_blank">cliquez ici</a>.';
        if (t.includes('photo')) return 'Pour ajouter une photo, envoyez-la à <b>chronosservices241@gmail.com</b> ou sur WhatsApp <b>065.37.08.82</b>.';
        if (t.includes('contact')||t.includes('support')||t.includes('aide')) return 'Contactez-nous par email à <b>chronosservices241@gmail.com</b> ou WhatsApp <b>065.37.08.82</b>.';
        if (['bonjour','salut','bonsoir','hello'].some(x=>t.includes(x))) return 'Bonjour ! Je suis là pour vous aider avec vos CV et lettres de motivation. Que souhaitez-vous faire ?';
        if (['merci','thanks'].some(x=>t.includes(x))) return 'Avec plaisir !';
        if (['au revoir','bye'].some(x=>t.includes(x))) return 'Au revoir et bonne chance dans vos démarches !';
        if (t.includes('étudiant')) return 'Pour un étudiant, mettez en avant votre formation, stages et compétences.';
        if (t.includes('professionnel')) return 'Pour un professionnel, valorisez vos expériences et réalisations.';
        if (t.includes('reconversion')) return 'Pour une reconversion, expliquez votre motivation et vos compétences transférables.';
        if (t.includes('confidentialité')||t.includes('sécurité')||t.includes('données')) return 'Vos données sont traitées avec respect et confidentialité.';
        if (t.includes('champ')&&t.includes('obligatoire')) return 'Les champs à remplir dépendent de votre profil. Remplissez ce qui correspond à votre parcours.';
        if (t.includes('profil')) return 'Quel est votre profil ? (étudiant, professionnel, sans expérience, etc.)';

        // Réponse générique
        return "Je peux vous aider à remplir votre formulaire étape par étape, donner des conseils pour la rédaction, ou répondre à vos questions. Que voulez-vous faire ?";
    }

    send.onclick = function() {
        var val = input.value;
        if(val) {
            addMessage(val, true);
            setTimeout(function(){addMessage(botReply(val), false);}, 400);
            input.value = '';
        }
    };
    input.onkeydown = function(e) {
        if(e.key==='Enter') send.onclick();
    };
});