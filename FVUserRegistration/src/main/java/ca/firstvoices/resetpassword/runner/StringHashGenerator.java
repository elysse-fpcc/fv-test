package ca.firstvoices.resetpassword.runner;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.core.api.NuxeoException;

public class StringHashGenerator {

    private static final byte[] SALT = "Hell0WorlDBr4nD".getBytes();

    public static String hashStrings(String... args) {
        byte[] txt = StringUtils.join(args, "-").getBytes();
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(SALT);
            byte[] bytes = md.digest(txt);
            StringBuilder sb = new StringBuilder();
            for (byte aByte : bytes) {
                sb.append(Integer.toString((aByte & 0xff) + 0x100, 16).substring(1));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new NuxeoException(e);
        }
    }

}
