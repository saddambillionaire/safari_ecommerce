import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

// Custom Hook réutilisable pour gérer la connexion Google et Apple
function useSocialAuth() {

  const [loadingStrategy, setLoadingStrategy] =
    useState<string | null>(null);

  // useSSO retourne un OBJET contenant plusieurs propriétés.
  //
  // Exemple simplifié :
  // {
  //   startSSOFlow: function(){},
  //   autrePropriete: ...
  // }
  //
  // Grâce à la destructuration d'objet,
  // on récupère uniquement startSSOFlow.
  const { startSSOFlow } = useSSO();

  // Fonction appelée lorsqu'on clique sur
  // "Continuer avec Google" ou "Continuer avec Apple"
  const handleSocialAuth = async (
    strategy: "oauth_google" | "oauth_apple"
  ) => {

    // Mémorise le provider en cours de chargement
    // pour afficher un spinner par exemple.
    setLoadingStrategy(strategy);

    try {

      // Lance le processus OAuth.
      //
      // Pour Google :
      // startSSOFlow({ strategy: "oauth_google" })
      //
      // Pour Apple :
      // startSSOFlow({ strategy: "oauth_apple" })
      //
      // Cette fonction ouvre le navigateur
      // puis attend que l'utilisateur se connecte.

      const {
        createdSessionId,
        setActive,
      } = await startSSOFlow({ strategy });

      // Si Clerk a créé une session valide
      if (createdSessionId && setActive) {

        // Rend cette session active.
        //
        // À partir de ce moment,
        // l'utilisateur est considéré comme connecté.
        await setActive({
          session: createdSessionId,
        });
      }

    } catch (error) {

      // Si une erreur survient pendant
      // le processus de connexion.
      console.log("💥 Error in social auth:", error);

      // Convertit la stratégie technique
      // en nom lisible pour l'utilisateur.
      const provider =
        strategy === "oauth_google"
          ? "Google"
          : "Apple";

      // Affiche une popup native.
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`
      );

    } finally {

      // Ce bloc s'exécute TOUJOURS :
      // succès ou erreur.

      // On retire l'état de chargement.
      setLoadingStrategy(null);
    }
  };

  // Les composants qui utilisent ce hook
  // recevront ces deux valeurs.
  return {
    loadingStrategy,
    handleSocialAuth,
  };
}

// Permet d'importer ce hook ailleurs.
export default useSocialAuth;