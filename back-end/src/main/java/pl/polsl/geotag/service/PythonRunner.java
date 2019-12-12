package pl.polsl.geotag.service;

import org.springframework.stereotype.Service;
import pl.polsl.geotag.decoder.Base64Decoder;
import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class PythonRunner {

    private static final String PYTHON_FILE_PATH = "python/ThumbnailCreator.py";

    public byte[] createThumbnail(String id) {
        try {
            ProcessBuilder pb = new ProcessBuilder("python", PYTHON_FILE_PATH, id);
            Process p = pb.start();
            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String scriptResult = in.readLine();
            return Base64Decoder.decodeValue(scriptResult);
        } catch (Exception e) {
            System.out.println(e);
        }        
        return null;
    }
}
