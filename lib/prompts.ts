export const CV_RECRUITER_PROMPT = `Prompt 1 :

Agis comme un recruteur senior pour cette entreprise en particulier. Analyse mon CV par rapport à cette offre d'emploi et donne-moi un score de compatibilité sur 100, les cinq mots-clés manquants les plus importants, ainsi que les trois red flags qu'un recruteur repérerait en moins de 10 secondes.

Prompt 2 :

Réécris ma section expérience en intégrant naturellement ces mots-clés et en supprimant les red flags. Utilise la formule Google XYZ : accomplir X, mesuré par Y, en faisant Z. EXEMPLE — AVANT / APRÈS Avant : « J'ai géré une équipe de 5 ingénieurs. » Après : « J'ai réduit le temps de déploiement de 40 % (mesuré par la vélocité de release hebdomadaire) en restructurant l'équipe en pôles transverses.

Prompt 3 :

Maintenant, agis comme un filtre ATS et comme un recruteur qui lit 200 CV d'affilée. Analyse mon nouveau CV et dis-moi quelles sections seraient ignorées, puis réécris-les pour qu'elles forcent vraiment le recruteur à s'arrêter dessus.

Prompt 4 :

Sors la version finale propre, prête à exporter. Et n'oublie pas de remplacer les éventuels [À COMPLÉTER] par tes vrais chiffres et les accents si tu les as oubliés.`
