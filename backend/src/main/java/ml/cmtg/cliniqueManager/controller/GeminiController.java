package ml.cmtg.cliniqueManager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import ml.cmtg.cliniqueManager.services.GeminiService;

@RestController
@RequestMapping("/ia")
public class GeminiController {

    @Autowired
    private GeminiService geminiService;

    // Endpoint de test : POST /ia/ask  { "prompt": "..." }
    @PostMapping("/ask")
    @PreAuthorize("hasRole('ADMIN')")
    public String ask(@RequestBody PromptRequest request) {
        return geminiService.generateText(request.getPrompt());
    }

    public static class PromptRequest {
        private String prompt;

        public String getPrompt() {
            return prompt;
        }

        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }
    }
}
