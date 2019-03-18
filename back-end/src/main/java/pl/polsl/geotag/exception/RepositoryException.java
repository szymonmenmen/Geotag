package pl.polsl.geotag.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class RepositoryException extends RuntimeException {

    private String message;

    public RepositoryException(String message) {
        super(message);
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
