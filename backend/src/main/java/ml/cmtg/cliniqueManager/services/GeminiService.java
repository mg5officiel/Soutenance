package ml.cmtg.cliniqueManager.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final ChatClient chatClient;

    public GeminiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String generateText(String prompt) {
        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

}
