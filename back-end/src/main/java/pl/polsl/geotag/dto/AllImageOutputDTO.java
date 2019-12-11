package pl.polsl.geotag.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
/**
 * Return JALO which represent all images
 */
public class AllImageOutputDTO {

    @JsonProperty("images")
    private List<ImageOutputDTO> positiveAnswers;

    public List<ImageOutputDTO> getPositiveAnswers() {
        return positiveAnswers;
    }

    public void setPositiveAnswers(List<ImageOutputDTO> positiveAnswers) {
        this.positiveAnswers = positiveAnswers;
    }

    public AllImageOutputDTO(List<ImageOutputDTO> positiveAnswers) {
        this.positiveAnswers = positiveAnswers;
    }
}
