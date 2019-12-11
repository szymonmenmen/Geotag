package pl.polsl.geotag.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public class ImageOutputDTO {
    
    private UUID id;

    @JsonProperty("file_name")
    private String fileName;

    private String src;

    private double latitude;

    private double longitude;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getSrc() {
        return src;
    }

    public void setSrc(String src) {
        this.src = src;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
