package pl.polsl.geotag.decoder;

import javax.xml.bind.DatatypeConverter;

public class Base64Decoder {

    // public static final String BASE_REGEX = "^data:([a-zA-Z0-9]+/[a-zA-Z0-9]+).*,.*";

    public static byte[] decodeValue(final String source) {
        // String base64Image = source.split(",")[1];
        return DatatypeConverter.parseBase64Binary(source);
    }
}
