import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { saveData, getData, STORAGE_TYPE } from '../services/firestoreService';
import { useEmulators } from '../config/firebase';

const StorageTestScreen = ({ navigation }) => {
  const [note, setNote] = useState('');
  const [localData, setLocalData] = useState([]);
  const [cloudData, setCloudData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Collection name for our notes
  const COLLECTION_NAME = 'notes';

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load data from both sources
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Get local data
      const localNotes = await getData(COLLECTION_NAME, STORAGE_TYPE.LOCAL);
      setLocalData(localNotes);
      
      // Get cloud data
      const cloudNotes = await getData(COLLECTION_NAME, STORAGE_TYPE.CLOUD);
      setCloudData(cloudNotes);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save note to local storage (emulator)
  const saveLocalNote = async () => {
    if (!note.trim()) {
      Alert.alert('Error', 'Please enter a note');
      return;
    }
    
    setIsLoading(true);
    try {
      await saveData(COLLECTION_NAME, { 
        text: note,
        device: 'mobile'
      }, STORAGE_TYPE.LOCAL);
      
      setNote('');
      Alert.alert('Success', 'Note saved locally (emulator)');
      loadData();
    } catch (error) {
      console.error('Error saving local note:', error);
      Alert.alert('Error', 'Failed to save local note: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save note to cloud
  const saveCloudNote = async () => {
    if (!note.trim()) {
      Alert.alert('Error', 'Please enter a note');
      return;
    }
    
    setIsLoading(true);
    try {
      await saveData(COLLECTION_NAME, { 
        text: note,
        device: 'mobile'
      }, STORAGE_TYPE.CLOUD);
      
      setNote('');
      Alert.alert('Success', 'Note saved to cloud');
      loadData();
    } catch (error) {
      console.error('Error saving cloud note:', error);
      Alert.alert('Error', 'Failed to save cloud note: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Render a note item
  const renderNoteItem = ({ item, storageType }) => (
    <View style={styles.noteItem}>
      <MaterialCommunityIcons 
        name={storageType === STORAGE_TYPE.LOCAL ? 'database' : 'cloud'} 
        size={20} 
        color={storageType === STORAGE_TYPE.LOCAL ? '#9c27b0' : '#2196f3'} 
      />
      <Text style={styles.noteText}>{item.text}</Text>
      <Text style={styles.noteDate}>
        {new Date(item.createdAt.seconds * 1000).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Emulator Status */}
      <TouchableOpacity
        style={[
          styles.emulatorStatus,
          { backgroundColor: useEmulators ? '#9c27b0' : '#ff5722' }
        ]}
        onPress={() => Alert.alert(
          'Emulator Status',
          useEmulators 
            ? 'You are using Firebase Emulators. Data marked as "Local" is stored in your local emulator.'
            : 'You are using Firebase Cloud services. All data is stored in the cloud.'
        )}
      >
        <MaterialCommunityIcons
          name={useEmulators ? 'database' : 'cloud'}
          size={16}
          color="white"
        />
        <Text style={styles.emulatorText}>
          {useEmulators ? 'Using Local Firebase' : 'Using Cloud Firebase'}
        </Text>
      </TouchableOpacity>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Enter a note"
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.localButton]}
            onPress={saveLocalNote}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="database-plus" size={20} color="white" />
            <Text style={styles.buttonText}>Save Locally</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cloudButton]}
            onPress={saveCloudNote}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="cloud-upload" size={20} color="white" />
            <Text style={styles.buttonText}>Save to Cloud</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Local Data Section */}
      <View style={styles.dataSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="database" size={20} color="#9c27b0" />
          <Text style={styles.sectionTitle}>Local Data ({localData.length})</Text>
        </View>
        <FlatList
          data={localData}
          keyExtractor={(item) => item.id}
          renderItem={(props) => renderNoteItem({ ...props, storageType: STORAGE_TYPE.LOCAL })}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No local data yet</Text>
          }
          style={styles.list}
        />
      </View>

      {/* Cloud Data Section */}
      <View style={styles.dataSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="cloud" size={20} color="#2196f3" />
          <Text style={styles.sectionTitle}>Cloud Data ({cloudData.length})</Text>
        </View>
        <FlatList
          data={cloudData}
          keyExtractor={(item) => item.id}
          renderItem={(props) => renderNoteItem({ ...props, storageType: STORAGE_TYPE.CLOUD })}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No cloud data yet</Text>
          }
          style={styles.list}
        />
      </View>

      {/* Refresh Button */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadData}
        disabled={isLoading}
      >
        <MaterialCommunityIcons name="refresh" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  emulatorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  emulatorText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 4,
    flex: 0.48,
  },
  localButton: {
    backgroundColor: '#9c27b0',
  },
  cloudButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dataSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flex: 1,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noteText: {
    flex: 1,
    marginLeft: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 16,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#ff9800',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
})

export default StorageTestScreen; 