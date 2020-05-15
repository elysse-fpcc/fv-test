package ca.firstvoices.format_producers;

import static ca.firstvoices.utils.FVExportConstants.CSV_FORMAT;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;

/*
    Producer assembling output formatted as CSV.
*/
import ca.firstvoices.property_readers.FV_BooleanPropertyReader;
import ca.firstvoices.property_readers.FV_CategoryPropertyReader;
import ca.firstvoices.property_readers.FV_CompoundPropertyReader;
import ca.firstvoices.property_readers.FV_PartOfSpeechPropertyReader;
import ca.firstvoices.property_readers.FV_PropertyReader;
import ca.firstvoices.property_readers.FV_SimpleListPropertyReader;
import ca.firstvoices.property_readers.FV_WordTranslationReader;
import ca.firstvoices.utils.FVExportConstants;
import ca.firstvoices.utils.FV_WordExportCSVColumns;

public class FV_WordCSVProducer extends FV_AbstractProducer

{
    private static Log log = LogFactory.getLog(FV_WordCSVProducer.class);

    protected FV_SimpleCSVWriter csvWriter;

    public FV_WordCSVProducer(CoreSession session, String fileName, StringList columns) {
        super(session, new FV_WordExportCSVColumns());

        try {
            addReaders(columns);

            if (createTemporaryOutputFile(fileName, CSV_FORMAT)) {

            } else {
                throw new IOException("FV_WordCSVProducer: error creating temporary file for export of " + fileName);
            }
        } catch (IOException e) {
            log.error(e);
        }
    }

    @Override
    protected void writeLine(List<String> outputLine) {
        try {
            getCsvWriter().writeNext(outputLine);

            getCsvWriter().flush();
        } catch (IOException e) {
            log.error(e);
        }
    }

    @Override
    protected void endProduction() {
        try {
            getCsvWriter().close();
        } catch (IOException e) {
            log.error(e);
        }
    }

    @Override
    protected void createDefaultPropertyReaders() {
        // Binding spec for this producer Key to reader binding binding spec owner
        propertyReaders.add(new FV_PropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.TITLE), this));
        propertyReaders.add(new FV_PartOfSpeechPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.PART_OF_SPEECH_ID), this));
        propertyReaders.add(new FV_PropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.PHONETIC_INFO), this));
        propertyReaders.add(new FV_WordTranslationReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION), this));
        propertyReaders.add(new FV_WordTranslationReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.LITERAL_TRANSLATION), this));
        propertyReaders.add(new FV_CategoryPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.REALTED_PHRASE), this));
        propertyReaders.add(new FV_SimpleListPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.CULTURAL_NOTE), this));
        propertyReaders.add(new FV_CategoryPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.CATEGORIES), this));
        propertyReaders.add(new FV_PropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.REFERENCE), this));
        propertyReaders.add(new FV_BooleanPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.AVAILABLE_IN_CHILDRENS_ARCHIVE), this));
        propertyReaders.add(new FV_BooleanPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.AVAILABLE_IN_GAMES), this));
        propertyReaders.add(new FV_PropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.ASSIGNED_USR_ID), this));
        propertyReaders.add(new FV_PropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.WORD_STATUS), this));
        propertyReaders.add(new FV_SimpleListPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.CONTRIBUTOR), this));
        propertyReaders.add(new FV_PropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.CHANGE_DTTM), this));

        hasCompoundReaders = true; // have to set this flag manually as property readers are created manually
        propertyReaders.add(new FV_CompoundPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.IMAGE), this));
        propertyReaders.add(new FV_CompoundPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.AUDIO), this));
        propertyReaders.add(new FV_CompoundPropertyReader(session,
                spec.getColumnExportRecord(FVExportConstants.ExportCSVLabels.VIDEO), this));
    }

    protected FV_SimpleCSVWriter getCsvWriter() throws IOException {
        if (csvWriter == null) {
            csvWriter = new FV_SimpleCSVWriter(new FileWriter(outputFile));
        }
        return csvWriter;
    }
}
