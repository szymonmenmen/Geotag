package pl.polsl.geotag.service;

import org.python.core.PyObject;
import org.python.core.PyString;
import org.python.util.PythonInterpreter;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

@Service
public class PythonRunner {

    public String convertImage(String bytes) throws FileNotFoundException {

        PythonInterpreter pythonInterpreter = new PythonInterpreter();
         File pythonFile = new File("python/ThumbnailCreator.py");
        InputStream is = new FileInputStream(pythonFile);
        pythonInterpreter.execfile(is);
        PyObject function = pythonInterpreter.get("decode_img");
        PyObject result = function.__call__(new PyString(bytes));
        String napis = (String) result.__tojava__(String.class);


        System.out.println(napis);


//        pythonInterpreter.eval("repr(createThumbnail())");
        return null;
    }
}
