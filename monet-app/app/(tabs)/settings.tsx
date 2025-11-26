// app/(tabs)/config.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { PageHeader } from '@/components/ui';
import { useConfigViewModel } from '@/src/viewmodels/tabs/useSettingsViewModel';

export default function ConfigScreen() {
  const {
    currentUser,
    settings,
    loading,
    handleToggleSetting,
    handleLogout,
    handleDeleteAccount,
    handleExportData,
  } = useConfigViewModel();

  return (
    <ThemedView style={styles.container}>
      <PageHeader
        title="Configuración"
        subtitle="Personaliza tu experiencia"
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile */}
        <View style={styles.profileCard}>
          <View style={styles.profileIconContainer}>
            <Ionicons name="person-circle" size={64} color="#10B981" />
          </View>
          <Text style={styles.profileName}>
            {currentUser?.displayName || 'Usuario'}
          </Text>
          <Text style={styles.profileEmail}>{currentUser?.email}</Text>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="notifications-outline" size={24} color="#3B82F6" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>
                    Notificaciones push
                  </Text>
                  <Text style={styles.settingDescription}>
                    Recibe alertas importantes
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={() => handleToggleSetting('pushNotifications')}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="flag-outline" size={24} color="#F59E0B" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>
                    Objetivos vencidos
                  </Text>
                  <Text style={styles.settingDescription}>
                    Alerta cuando una meta está por vencer
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.goalDeadlineNotifications}
                onValueChange={() => handleToggleSetting('goalDeadlineNotifications')}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#fff"
                disabled={!settings.pushNotifications}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="wallet-outline" size={24} color="#EF4444" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>
                    Presupuesto excedido
                  </Text>
                  <Text style={styles.settingDescription}>
                    Notifica cuando superes un límite
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.budgetExceededNotifications}
                onValueChange={() => handleToggleSetting('budgetExceededNotifications')}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#fff"
                disabled={!settings.pushNotifications}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="calendar-outline" size={24} color="#8B5CF6" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>
                    Recordatorio diario
                  </Text>
                  <Text style={styles.settingDescription}>
                    Revisa tus finanzas cada día
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.dailyReminder}
                onValueChange={() => handleToggleSetting('dailyReminder')}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#fff"
                disabled={!settings.pushNotifications}
              />
            </View>
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidad</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="eye-off-outline" size={24} color="#6B7280" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>
                    Ocultar montos
                  </Text>
                  <Text style={styles.settingDescription}>
                    Ocultar saldos por defecto
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.hideAmounts}
                onValueChange={() => handleToggleSetting('hideAmounts')}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="download-outline" size={24} color="#3B82F6" />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Exportar datos</Text>
                <Text style={styles.actionDescription}>
                  Descarga tu información en CSV
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versión</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Desarrollador</Text>
              <Text style={styles.infoValue}>MONET Team</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.linkButton}>
            <Ionicons name="document-text-outline" size={20} color="#6B7280" />
            <Text style={styles.linkText}>Términos y condiciones</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
            <Text style={styles.linkText}>Política de privacidad</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
            <Text style={styles.linkText}>Centro de ayuda</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de peligro</Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleLogout}
            disabled={loading}
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, styles.dangerButtonDelete]}
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
            <Text style={styles.dangerButtonTextWhite}>Eliminar cuenta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileIconContainer: {
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 72,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  linkText: {
    fontSize: 15,
    color: '#1F2937',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  dangerButtonDelete: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  dangerButtonTextWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 40,
  },
});