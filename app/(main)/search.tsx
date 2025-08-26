// app/(main)/search.tsx
import { useState } from 'react';
import { View, ScrollView, Text, FlatList, Image, Modal } from 'react-native';
import { TextInput, Button, Chip, ActivityIndicator, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import WebView from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import JSZip from 'jszip';
import moment from 'moment';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import * as api from '../../services/api';

const majorHeads = ['Personal', 'Professional'];
const minorHeadsPersonal = ['John', 'Tom', 'Emily'];
const minorHeadsProfessional = ['Accounts', 'HR', 'IT', 'Finance'];

export default function Search() {
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState('');
  const [previewType, setPreviewType] = useState('');
  const { token } = useContext(AuthContext);

  const minorOptions = major === 'Personal' ? minorHeadsPersonal : major === 'Professional' ? minorHeadsProfessional : [];

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tag) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const search = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        major_head: major,
        minor_head: minor,
        from_date: fromDate ? moment(fromDate).format('DD-MM-YYYY') : '',
        to_date: toDate ? moment(toDate).format('DD-MM-YYYY') : '',
        tags,
      };
      const docs = await api.searchDocuments(params, token);
      setResults(docs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const preview = (doc) => {
    const ext = doc.file_path.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      setPreviewType('image');
    } else if (ext === 'pdf') {
      setPreviewType('pdf');
    } else {
      setError('Preview not available for this file type');
      return;
    }
    setPreviewFile(doc.file_path);
    setPreviewVisible(true);
  };

  const download = async (doc) => {
    setLoading(true);
    try {
      const filename = doc.file_path.split('/').pop();
      const localUri = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.downloadAsync(doc.file_path, localUri, { headers: { token } });
      await Sharing.shareAsync(localUri);
    } catch (e) {
      setError('Download failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadAllZip = async () => {
    if (results.length === 0) return;
    setLoading(true);
    try {
      const zip = new JSZip();
      for (const doc of results) {
        const filename = doc.file_path.split('/').pop();
        const downloadRes = await FileSystem.downloadAsync(doc.file_path, `${FileSystem.documentDirectory}${filename}`, { headers: { token } });
        const base64 = await FileSystem.readAsStringAsync(downloadRes.uri, { encoding: FileSystem.EncodingType.Base64 });
        zip.file(filename, base64, { base64: true });
      }
      const zipBase64 = await zip.generateAsync({ type: 'base64' });
      const zipUri = `${FileSystem.documentDirectory}documents.zip`;
      await FileSystem.writeAsStringAsync(zipUri, zipBase64, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(zipUri);
    } catch (e) {
      setError('ZIP download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Picker selectedValue={major} onValueChange={setMajor} style={{ marginVertical: 10 }}>
        <Picker.Item label="Select Major Head" value="" />
        {majorHeads.map(h => <Picker.Item key={h} label={h} value={h} />)}
      </Picker>
      <Picker selectedValue={minor} onValueChange={setMinor} enabled={!!major} style={{ marginVertical: 10 }}>
        <Picker.Item label="Select Minor Head" value="" />
        {minorOptions.map(h => <Picker.Item key={h} label={h} value={h} />)}
      </Picker>
      <Button mode="outlined" onPress={() => setShowFrom(true)}>From Date</Button>
      {fromDate && <Text>From: {moment(fromDate).format('DD-MM-YYYY')}</Text>}
      {showFrom && <DateTimePicker value={fromDate || new Date()} mode="date" onChange={(_, d) => { setShowFrom(false); setFromDate(d); }} />}
      <Button mode="outlined" onPress={() => setShowTo(true)}>To Date</Button>
      {toDate && <Text>To: {moment(toDate).format('DD-MM-YYYY')}</Text>}
      {showTo && <DateTimePicker value={toDate || new Date()} mode="date" onChange={(_, d) => { setShowTo(false); setToDate(d); }} />}
      <TextInput label="Add Tag" value={newTag} onChangeText={setNewTag} style={{ marginVertical: 10 }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
        {tags.map(t => <Chip key={t} onClose={() => removeTag(t)} style={{ margin: 4 }}>{t}</Chip>)}
      </View>
      <Button mode="outlined" onPress={() => addTag(newTag)} style={{ marginVertical: 10 }}>Add Tag</Button>
      {error && <HelperText type="error">{error}</HelperText>}
      {loading ? <ActivityIndicator /> : <Button mode="contained" onPress={search}>Search</Button>}
      <Button mode="contained" onPress={downloadAllZip} disabled={results.length === 0 || loading} style={{ marginVertical: 10 }}>Download All as ZIP</Button>
      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{item.minor_head} - {item.document_date} - {item.document_remarks}</Text>
            <Text>Tags: {item.tags.map(t => t.tag_name).join(', ')}</Text>
            <Button onPress={() => preview(item)}>Preview</Button>
            <Button onPress={() => download(item)}>Download</Button>
          </View>
        )}
      />
      <Modal visible={previewVisible} onDismiss={() => setPreviewVisible(false)} contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {previewType === 'image' ? (
            <Image source={{ uri: previewFile }} style={{ flex: 1, resizeMode: 'contain' }} />
          ) : (
            <WebView source={{ uri: previewFile, headers: { token } }} style={{ flex: 1 }} />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}