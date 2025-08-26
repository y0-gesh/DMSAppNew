// app/(main)/upload.tsx
import { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TextInput, Button, Chip, ActivityIndicator, HelperText, List } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import moment from 'moment';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import * as api from '../../services/api';

const majorHeads = ['Personal', 'Professional'];
const minorHeadsPersonal = ['John', 'Tom', 'Emily'];
const minorHeadsProfessional = ['Accounts', 'HR', 'IT', 'Finance'];

export default function Upload() {
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [remarks, setRemarks] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, userId } = useContext(AuthContext);

  const minorOptions = major === 'Personal' ? minorHeadsPersonal : major === 'Professional' ? minorHeadsProfessional : [];

  useEffect(() => {
    setMinor('');
  }, [major]);

  const fetchSuggestions = async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.getTags(term, token);
      setSuggestions(res.filter((t: string) => !tags.includes(t)));
    } catch (e) {
      setError('Failed to load tag suggestions');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tag) {
      setTags([...tags, tag]);
      setNewTag('');
      setSuggestions([]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'] });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const submit = async () => {
    if (!date || !major || !minor || tags.length === 0 || !file) {
      setError('Please fill all required fields and select a file');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = {
        major_head: major,
        minor_head: minor,
        document_date: moment(date).format('DD-MM-YYYY'),
        document_remarks: remarks,
        tags: tags.map(tag => ({ tag_name: tag })),
        user_id: userId,
      };
      await api.uploadDocument(file, data, token);
      setDate(new Date());
      setMajor('');
      setMinor('');
      setRemarks('');
      setTags([]);
      setFile(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button mode="outlined" onPress={() => setShowDate(true)}>Select Document Date</Button>
      <Text style={{ marginVertical: 10 }}>Selected: {moment(date).format('DD-MM-YYYY')}</Text>
      {showDate && <DateTimePicker value={date} mode="date" onChange={(_, d) => { setShowDate(false); if (d) setDate(d); }} />}
      <Picker selectedValue={major} onValueChange={setMajor} style={{ marginVertical: 10 }}>
        <Picker.Item label="Select Major Head" value="" />
        {majorHeads.map(h => <Picker.Item key={h} label={h} value={h} />)}
      </Picker>
      <Picker selectedValue={minor} onValueChange={setMinor} enabled={!!major} style={{ marginVertical: 10 }}>
        <Picker.Item label="Select Minor Head" value="" />
        {minorOptions.map(h => <Picker.Item key={h} label={h} value={h} />)}
      </Picker>
      <TextInput label="Remarks" value={remarks} onChangeText={setRemarks} multiline style={{ marginVertical: 10 }} />
      <TextInput label="Add Tag" value={newTag} onChangeText={(t) => { setNewTag(t); fetchSuggestions(t); }} style={{ marginVertical: 10 }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
        {tags.map(t => <Chip key={t} onClose={() => removeTag(t)} style={{ margin: 4 }}>{t}</Chip>)}
      </View>
      {suggestions.length > 0 && (
        <List.Section title="Suggestions">
          {suggestions.map(s => <List.Item key={s} title={s} onPress={() => addTag(s)} />)}
        </List.Section>
      )}
      <Button mode="outlined" onPress={() => addTag(newTag)} style={{ marginVertical: 10 }}>Add Tag</Button>
      <Button mode="outlined" onPress={pickFile} style={{ marginVertical: 10 }}>Select File/PDF</Button>
      <Button mode="outlined" onPress={takePhoto} style={{ marginVertical: 10 }}>Take Photo</Button>
      {file && <Text style={{ marginVertical: 10 }}>Selected: {file.name}</Text>}
      {error && <HelperText type="error">{error}</HelperText>}
      {loading ? <ActivityIndicator /> : <Button mode="contained" onPress={submit}>Upload Document</Button>}
    </ScrollView>
  );
}