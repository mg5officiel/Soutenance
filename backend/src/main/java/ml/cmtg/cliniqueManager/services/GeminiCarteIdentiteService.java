package ml.cmtg.cliniqueManager.services;

import ml.cmtg.cliniqueManager.dto.CarteIdentiteDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.content.Media;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class GeminiCarteIdentiteService {

    private static final String PROMPT = """
            Analyse cette image de carte d'identité et extrait précisément chaque champ visible.
            Respecte l'orthographe exacte telle qu'elle apparaît sur le document.
            Si un champ n'est pas visible ou illisible, retourne une chaîne vide pour ce champ.
            Ne fournis aucun texte en dehors du format demandé.
            """;
    private final ChatClient chatClient;

    public GeminiCarteIdentiteService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public CarteIdentiteDTO extraireDonnees(MultipartFile fichier) throws IOException {
        String mimeType = fichier.getContentType() != null ? fichier.getContentType() : "image/jpeg";
        Media image = new Media(MimeType.valueOf(mimeType), fichier.getResource());

        return chatClient.prompt()
                .user(u -> u.text(PROMPT).media(image))
                .call()
                .entity(CarteIdentiteDTO.class);
    }
}
