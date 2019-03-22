package pl.polsl.geotag.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class SortedImageDTO {

    @JsonProperty("objects")
    private List<AllImageOutputDTO> objects;

    public SortedImageDTO(List<AllImageOutputDTO> objects) {
        this.objects = objects;
    }

    public List<AllImageOutputDTO> getObjects() {
        return objects;
    }

    public void setObjects(List<AllImageOutputDTO> objects) {
        this.objects = objects;
    }
}
